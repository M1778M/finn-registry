/// <reference types="@cloudflare/workers-types" />

declare module 'cloudflare:test' {
  interface ProvidedEnv {
    finn_db: D1Database;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    APP_URL: string;
  }

  export const env: ProvidedEnv;
  export const SELF: {
    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  };
}
