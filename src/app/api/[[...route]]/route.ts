import { Hono } from "hono";
import { handle } from "hono/vercel";
import { env } from "hono/adapter";
import { setCookie, getCookie } from "hono/cookie";
import { z } from "zod";
import { db, getDb } from "@/lib/db";
import { users, packages, versions, logins, packageStats, dependencies, sessions, authCodes, organizations, organizationMembers, apiKeys } from "@/lib/db/schema";
import { eq, like, or, desc, sql, and } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";
import {
  verifyToken,
  verifyApiKey,
  generateApiKey,
  hashApiKey,
  generateToken,
  createSession,
  verifySession,
  deleteSession,
  createAuthCode,
  exchangeAuthCode,
  generateRandomString
} from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const app = new Hono().basePath("/api");

// Global rate limit
app.use("*", rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests from this IP" }));

// Auth middleware
async function getAuth(c: any) {
  const authHeader = c.req.header("Authorization");
  let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : (authHeader || c.req.query("token"));

  if (!token) {
    token = getCookie(c, "auth_token");
    if (token) {
      console.log(`[AUTH] Found cookie token: ${token.substring(0, 8)}...`);
    }
  }

  if (!token) {
    console.log("[AUTH] No token found in header, query, or cookie");
    return null;
  }

  // Check session token
  try {
    const session = await verifySession(token, c.env);
    if (session) {
      const currentDb = getDb(c.env);
      const user = await currentDb.select().from(users).where(eq(users.id, session.userId)).get();
      if (user) {
        console.log(`[AUTH] Session verified for user: ${user.login}`);
        return { id: user.id, login: user.login };
      }
    }
  } catch (err) {
    console.error("[AUTH] Session verification error:", err);
  }

  // Check JWT (fallback)
  try {
    const payload = await verifyToken(token);
    if (payload) {
      console.log(`[AUTH] JWT verified for user: ${(payload as any).login}`);
      return payload as { id: string; login: string };
    }
  } catch (err) {
    console.error("[AUTH] JWT verification error:", err);
  }

  // Check API Key
  if (token.startsWith("fn_")) {
    const currentDb = getDb(c.env);
    try {
      const allKeys = await currentDb.select().from(apiKeys);
      for (const keyRecord of allKeys) {
        if (verifyApiKey(token, keyRecord.key)) {
          const user = await currentDb.select().from(users).where(eq(users.id, keyRecord.userId)).get();
          if (user) {
            console.log(`[AUTH] API Key verified for user: ${user.login}`);
            return {
              id: user.id,
              login: user.login,
              scopes: keyRecord.scopes ? keyRecord.scopes.split(",") : ["read", "publish", "delete"]
            };
          }
        }
      }
    } catch (err) {
      console.error("[AUTH] API Key verification failed:", err);
    }
  }

  console.log("[AUTH] All verification methods failed");
  return null;
}

// Fetch GitHub stats
async function fetchGitHubAnalytics(token: string, username: string) {
  try {
    const headers: any = { "User-Agent": "Finn-Registry" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });

    if (!reposRes.ok) return { totalStars: 0, totalForks: 0, topLanguages: [] };

    const repos = await reposRes.json();
    let totalStars = 0;
    let totalForks = 0;
    const languages: Record<string, number> = {};

    repos.forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const sortedLangs = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const totalReposWithLang = sortedLangs.reduce((sum, [_, count]) => sum + count, 0);
    const topLanguages = sortedLangs.map(([name, count]) => ({
      name,
      percentage: totalReposWithLang > 0 ? Math.round((count / totalReposWithLang) * 100) : 0
    }));

    return { totalStars, totalForks, topLanguages };
  } catch (e) {
    console.error("Error fetching GitHub analytics:", e);
    return { totalStars: 0, totalForks: 0, topLanguages: [] };
  }
}

// Validate scopes
function hasScope(auth: any, requiredScope: string) {
  if (!auth) return false;
  if (!auth.scopes) return true;
  return auth.scopes.includes(requiredScope);
}

// Get request origin
function getOrigin(c: any) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  const host = c.req.header("x-forwarded-host") || c.req.header("host") || "";
  const proto = c.req.header("x-forwarded-proto") || "https";

  let originHost = host;
  // Handle Daytona/Orchids proxying
  if (host.includes(".proxy.daytona.works")) {
    originHost = host.replace(".proxy.daytona.works", ".orchids.page");
  }

  const origin = `${proto}://${originHost}`;
  return origin.replace(/\/$/, "");
}

// Stats
app.get("/stats", async (c) => {
  try {
    const currentDb = getDb(c.env);
    const allPackages = await currentDb.select().from(packages);

    const totalDownloads = allPackages.reduce((sum, pkg) => sum + (pkg.downloads || 0), 0);
    const trendingPackages = [...allPackages].sort((a, b) => (b.stars || 0) - (a.stars || 0)).slice(0, 6);
    const topDownloadedPackages = [...allPackages].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 6);
    const recentPackages = [...allPackages].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 5);

    return c.json({ totalPackages: allPackages.length, totalDownloads, trendingPackages, topDownloadedPackages, recentPackages });
  } catch (err) {
    return c.json({ totalPackages: 0, totalDownloads: 0, trendingPackages: [], topDownloadedPackages: [], recentPackages: [] });
  }
});

// Search suggestions
app.get("/search/suggestions", async (c) => {
  const q = c.req.query("q") || "";
  if (q.length < 2) return c.json([]);
  try {
    const currentDb = getDb(c.env);
    const results = await currentDb.select({ name: packages.name }).from(packages).where(like(packages.name, `%${q}%`)).limit(5);
    return c.json(results.map(r => r.name));
  } catch (err) {
    return c.json([]);
  }
});

// Auth error page
function authError(c: any, title: string, message: string, details?: string) {
  const origin = getOrigin(c);
  const detailsHtml = details ? `<div class="bg-black/50 p-4 mb-6 border border-zinc-800 text-red-400 text-sm mono">${details}</div>` : "";

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"><title>Auth Error - Finn Registry</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>body { font-family: system-ui; background: #09090b; color: #fafafa; }</style>
    </head>
    <body class="min-h-screen flex items-center justify-center p-4">
      <div class="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <h1 class="text-2xl font-bold mb-4">${title}</h1>
        <p class="text-zinc-400 mb-6">${message}</p>
        ${detailsHtml}
        <div class="flex gap-3">
          <a href="${origin}" class="flex-1 bg-zinc-100 text-zinc-950 font-semibold py-3 rounded-xl text-center">Return Home</a>
          <a href="${origin}/api/auth/github" class="flex-1 bg-zinc-800 text-zinc-100 font-semibold py-3 rounded-xl text-center border border-zinc-700">Try Again</a>
        </div>
      </div>
    </body>
    </html>
  `, 400);
}

// GitHub auth
app.get("/auth/github", rateLimit({ windowMs: 5 * 60 * 1000, max: 10 }), (c) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return authError(c, "Configuration Missing", "GitHub Client ID is not configured.");

  const origin = getOrigin(c);
  const redirectUri = `${origin}/api/auth/github/callback`;
  const state = generateRandomString(32);

  setCookie(c, "oauth_state", state, { path: "/", httpOnly: true, secure: true, sameSite: "Lax", maxAge: 600 });

  const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;

  return c.html(`
    <!DOCTYPE html><html><head><title>Redirecting...</title></head><body style="background:#09090b;color:white;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui;">
      <div style="text-align:center;"><p>Connecting to GitHub...</p></div>
      <script>
        const url = "${authorizeUrl}";
        if (window.self !== window.top) {
          window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
        } else {
          window.location.href = url;
        }
      </script>
    </body></html>
  `);
});

app.get("/auth/github/callback", rateLimit({ windowMs: 5 * 60 * 1000, max: 10 }), async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getCookie(c, "oauth_state");

  if (!code) return authError(c, "Invalid Request", "No authorization code was provided.");
  if (!state || state !== storedState) return authError(c, "Session Expired", "Authentication session expired. Please try again.");

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const origin = getOrigin(c);
  const redirectUri = `${origin}/api/auth/github/callback`;

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) return authError(c, "Token Exchange Failed", tokenData.error_description || tokenData.error);

    const accessToken = tokenData.access_token;
    const [userRes, emailsRes] = await Promise.all([
      fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "Finn-Registry" } }),
      fetch("https://api.github.com/user/emails", { headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "Finn-Registry" } })
    ]);

    if (!userRes.ok) return authError(c, "GitHub Profile Error", "Failed to retrieve profile information.");
    const githubUser = await userRes.json();
    let primaryEmail = "";
    if (emailsRes.ok) {
      const emails = await emailsRes.json();
      primaryEmail = emails.find((e: any) => e.primary && e.verified)?.email || emails[0]?.email;
    }

    const currentDb = getDb(c.env);
    let user = await currentDb.select().from(users).where(eq(users.githubId, githubUser.id)).get();

    if (!user) {
      const result = await currentDb.insert(users).values({
        id: crypto.randomUUID(),
        githubId: githubUser.id,
        login: githubUser.login,
        email: primaryEmail || githubUser.email || "",
        name: githubUser.name || githubUser.login,
        avatarUrl: githubUser.avatar_url,
      }).returning();
      user = result[0];
    } else {
      await currentDb.update(users).set({
        login: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        name: githubUser.name || githubUser.login,
        email: primaryEmail || user.email || ""
      }).where(eq(users.id, user.id));
    }

    const sessionToken = await createSession(user.id, c.env);

    // Update stats in background
    fetchGitHubAnalytics(accessToken, githubUser.login).then(stats => {
      currentDb.update(users).set({
        githubStars: stats.totalStars,
        githubForks: stats.totalForks,
        githubLanguages: JSON.stringify(stats.topLanguages)
      }).where(eq(users.id, user.id)).execute().catch(console.error);
    }).catch(console.error);

    try {
      const forwardedFor = c.req.header("x-forwarded-for");
      const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : (c.req.header("x-real-ip") || "127.0.0.1");

      await currentDb.insert(logins).values({
        id: crypto.randomUUID(),
        userId: user.id,
        ipAddress: ipAddress,
        userAgent: c.req.header("user-agent") || "Unknown",
      });
    } catch { }

    const domain = origin.replace("https://", "").split(":")[0];

    setCookie(c, "auth_token", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60,
      domain: domain.includes("orchids.page") ? domain : undefined
    });

    return c.redirect(`${origin}/dashboard`);
  } catch (err: any) {
    console.error("[AUTH] Fatal Error:", err);
    return authError(c, "Server Error", "An unexpected error occurred.");
  }
});

app.get("/auth/status", async (c) => {
  const auth = await getAuth(c);
  if (!auth) return c.json({ authenticated: false });
  const currentDb = getDb(c.env);
  const dbUser = await currentDb.select().from(users).where(eq(users.id, auth.id)).get();
  return c.json({ authenticated: true, user: dbUser });
});

app.post("/auth/logout", async (c) => {
  const token = getCookie(c, "auth_token");
  if (token) await deleteSession(token, c.env);
  setCookie(c, "auth_token", "", { path: "/", maxAge: 0 });
  return c.json({ success: true });
});

app.get("/dashboard/data", async (c) => {
  const auth = await getAuth(c);
  if (!auth) return c.json({ error: "Unauthorized" }, 401);

  try {
    const currentDb = getDb(c.env);
    const user = await currentDb.select().from(users).where(eq(users.id, auth.id)).get();
    if (!user) return c.json({ error: "User not found" }, 404);

    const userPackages = await currentDb.select().from(packages).where(eq(packages.ownerId, auth.id));

    let userLogins: any[] = [];
    try {
      userLogins = await currentDb.select().from(logins).where(eq(logins.userId, auth.id)).orderBy(desc(logins.createdAt)).limit(10);
    } catch (e) {
      console.error("[DASHBOARD] Logins fetch error:", e);
    }

    const githubAnalytics = {
      totalStars: (user as any).githubStars || 0,
      totalForks: (user as any).githubForks || 0,
      contributions: userPackages.reduce((acc, p) => acc + (p.stars || 0), 0),
      topLanguages: (user as any).githubLanguages ? JSON.parse((user as any).githubLanguages) : []
    };

    let userApiKeys: any[] = [];
    try {
      userApiKeys = await currentDb.select({
        id: apiKeys.id,
        name: apiKeys.name,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt
      }).from(apiKeys).where(eq(apiKeys.userId, auth.id));
    } catch (e) {
      console.error("[DASHBOARD] API Keys fetch error:", e);
    }

    return c.json({ user, packages: userPackages, logins: userLogins, githubAnalytics, apiKeys: userApiKeys });
  } catch (err) {
    console.error("[DASHBOARD] Error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

app.get("/packages", async (c) => {
  const q = c.req.query("q") || "";
  const sort = c.req.query("sort") || "downloads";
  try {
    const currentDb = getDb(c.env);
    let query = currentDb.select().from(packages);
    if (q) query = query.where(or(like(packages.name, `%${q}%`), like(packages.description, `%${q}%`))) as any;
    if (sort === "stars") query = query.orderBy(desc(packages.stars)) as any;
    else if (sort === "recent") query = query.orderBy(desc(packages.createdAt)) as any;
    else query = query.orderBy(desc(packages.downloads)) as any;
    return c.json(await query.limit(50));
  } catch (err) {
    return c.json([]);
  }
});

app.patch("/me/settings", async (c) => {
  const auth = await getAuth(c);
  if (!auth) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { name, email, bio, location, blog } = await c.req.json();
    const currentDb = getDb(c.env);
    await currentDb.update(users).set({ name, email, bio, location, blog }).where(eq(users.id, auth.id));
    return c.json({ success: true });
  } catch { return c.json({ error: "Failed" }, 500); }
});

app.post("/me/api-key", async (c) => {
  const auth = await getAuth(c);
  if (!auth) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { name, description } = await c.req.json();
    const apiKey = generateApiKey();
    const hashedKey = hashApiKey(apiKey);
    const currentDb = getDb(c.env);
    const result = await currentDb.insert(apiKeys).values({ id: crypto.randomUUID(), userId: auth.id, name, description, key: hashedKey }).returning();
    return c.json({ apiKey, keyRecord: result[0] });
  } catch { return c.json({ error: "Failed" }, 500); }
});

app.delete("/me/api-key/:id", async (c) => {
  const auth = await getAuth(c);
  if (!auth) return c.json({ error: "Unauthorized" }, 401);
  try {
    const currentDb = getDb(c.env);
    await currentDb.delete(apiKeys).where(and(eq(apiKeys.id, c.req.param("id")), eq(apiKeys.userId, auth.id)));
    return c.json({ success: true });
  } catch { return c.json({ error: "Failed" }, 500); }
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
