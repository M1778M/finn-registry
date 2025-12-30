import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Using UUID or text ID
  githubId: integer("github_id").unique().notNull(),
  login: text("login").notNull(),
  email: text("email"),
  name: text("name"),
  bio: text("bio"),
  location: text("location"),
  blog: text("blog"),
  avatarUrl: text("avatar_url"),
  githubStars: integer("github_stars").default(0),
  githubForks: integer("github_forks").default(0),
  githubLanguages: text("github_languages"), // JSON string
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  key: text("key").unique().notNull(), // Hashed key
  scopes: text("scopes").default("read,publish,delete"),
  lastUsedAt: text("last_used_at"),
  expiresAt: text("expires_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  token: text("token").unique().notNull(),
  expiresAt: integer("expires_at").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const authCodes = sqliteTable("auth_codes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  code: text("code").unique().notNull(),
  expiresAt: integer("expires_at").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const logins = sqliteTable("logins", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const packageStats = sqliteTable("package_stats", {
  id: text("id").primaryKey(),
  packageId: text("package_id").references(() => packages.id).notNull(),
  date: text("date").notNull(), // YYYY-MM-DD
  downloads: integer("downloads").default(0),
});

export const packages = sqliteTable("packages", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  repoUrl: text("repo_url"),
  homepage: text("homepage"),
  ownerId: text("owner_id").references(() => users.id).notNull(),
  organizationId: text("organization_id").references(() => organizations.id),
  downloads: integer("downloads").default(0),
  stars: integer("stars").default(0),
  category: text("category").default("Utilities"),
  isVerified: integer("is_verified").default(0),
  isDeprecated: integer("is_deprecated").default(0),
  deprecationMessage: text("deprecation_message"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const versions = sqliteTable("versions", {
  id: text("id").primaryKey(),
  packageId: text("package_id").references(() => packages.id).notNull(),
  version: text("version").notNull(),
  readmeContent: text("readme_content"),
  checksum: text("checksum"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const dependencies = sqliteTable("dependencies", {
  id: text("id").primaryKey(),
  versionId: text("version_id").references(() => versions.id).notNull(),
  dependencyName: text("dependency_name").notNull(), // e.g. "user/package"
  versionRange: text("version_range").notNull(), // e.g. "^1.0.0"
});

export const organizations = sqliteTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(), // lowercased e.g. "finn"
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  description: text("description"),
  ownerId: text("owner_id").references(() => users.id).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const organizationMembers = sqliteTable("organization_members", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").references(() => organizations.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  role: text("role").default("member"), // "owner", "admin", "member"
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  packages: many(packages),
  organizationMemberships: many(organizationMembers),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
  }),
  members: many(organizationMembers),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
}));

export const packagesRelations = relations(packages, ({ one, many }) => ({
  owner: one(users, {
    fields: [packages.ownerId],
    references: [users.id],
  }),
  versions: many(versions),
}));

export const versionsRelations = relations(versions, ({ one }) => ({
  package: one(packages, {
    fields: [versions.packageId],
    references: [packages.id],
  }),
}));
