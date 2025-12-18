# GitHub OAuth Setup Guide

## Step 1: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: Finn Registry Dev (or your preferred name)
   - **Homepage URL**: http://localhost:3000
   - **Application description**: Package registry for Fin language
   - **Authorization callback URL**: http://localhost:3000/api/auth/callback

4. Click "Create OAuth application"
5. You'll see:
   - Client ID
   - Client Secret

## Step 2: Set Up Local Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your credentials:
   ```
   GITHUB_CLIENT_ID=your_client_id_from_step_1
   GITHUB_CLIENT_SECRET=your_client_secret_from_step_1
   APP_URL=http://localhost:3000
   ```

3. Save the file

## Step 3: Start Local Development Server

```bash
npm run pages:dev
```

You should see:
```
⛅ wrangler (1.2.3)
🌍 Listening at http://localhost:3000
```

## Step 4: Test GitHub OAuth Flow

1. Open http://localhost:3000 in your browser
2. Click "Sign In" button
3. You'll be redirected to GitHub
4. Click "Authorize" 
5. You should be redirected back to http://localhost:3000/account
6. Your account page should show:
   - Your GitHub username
   - Your GitHub avatar
   - Your API token (starts with `finn_tok_`)

## Step 5: Verify Data in Database

To check that user data was created in D1:

```bash
wrangler d1 shell finn-db --local
```

Then query:
```sql
SELECT * FROM users;
SELECT * FROM sessions;
```

You should see your user and session entries.

## Step 6: Test Publishing a Package

1. On the account page, click "Publish Package"
2. Fill in:
   - **Name**: `test-pkg-your-username` (must be unique)
   - **Description**: "Test package"
   - **Repository URL**: `https://github.com/username/test-repo`
   - **License**: MIT

3. Click "Publish Package"
4. You should be redirected to the package page
5. Visit `/packages` and you should see your package

## Step 7: Test Search

1. On home page, search for your package name
2. It should appear in results
3. Click to view package details

## Troubleshooting

### "Unauthorized" at GitHub
- Make sure you clicked "Authorize"
- Check that callback URL matches in GitHub settings

### "Session not found" error
- Clear your browser cookies
- Try logging in again
- Check that `sessions` table has entries: `SELECT * FROM sessions;`

### Package not appearing after publish
- Check that package was created: `SELECT * FROM packages;`
- Try refreshing the page
- Check browser console for errors

### Build/Test failures
- Run `npm test` to see test status
- Run `npm run lint` to check code quality
- Run `npm run build` to verify build

## Production Deployment

When ready to deploy to production:

1. Create a new GitHub OAuth App for production
   - Homepage URL: https://your-domain.com
   - Callback URL: https://your-domain.com/api/auth/callback

2. Set production secrets on Cloudflare:
   ```bash
   wrangler secret put GITHUB_CLIENT_ID --env production
   wrangler secret put GITHUB_CLIENT_SECRET --env production
   ```

3. Update wrangler.jsonc for production:
   ```json
   "vars": {
     "GITHUB_CLIENT_ID": "your_prod_client_id",
     "APP_URL": "https://your-domain.com"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## Notes

- Never commit `.env.local` (it's in .gitignore)
- Keep `GITHUB_CLIENT_SECRET` secret
- Use different OAuth apps for dev and production
- Session data expires after 30 days
- API tokens can be regenerated anytime

## Support

If you have issues:
1. Check the OAuth app settings in GitHub
2. Verify callback URLs match exactly
3. Clear browser cookies and try again
4. Check worker logs: `wrangler tail`
