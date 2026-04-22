# Firebase OAuth Configuration Guide

## Problem
`auth/configuration-not-found` error occurs when Firebase OAuth providers (Google, Apple) are not properly configured in the Firebase Console.

## Solution: Configure OAuth Providers

### Step 1: Configure Google Sign-In

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project "callisthenix-a7431"
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Enable it and set up OAuth consent screen:
   - Go to **Google Cloud Console** → **APIs & Services** → **OAuth consent screen**
   - Select **External** user type
   - Fill in app name: "CallistheniX"
   - Add your email
   - Add scopes: `profile`, `email`
   - Save

6. **Add Authorized Domains** in Firebase Console:
   - Go to **Authentication** → **Settings** → **Authorized domains**
   - Add these domains:
     ```
     localhost
     127.0.0.1
     calisthenx-cajndno7.manus.space
     your-custom-domain.com (if you have one)
     ```

7. **Add Authorized JavaScript Origins** in Google Cloud Console:
   - Go to **Google Cloud Console** → **APIs & Services** → **Credentials**
   - Find your OAuth 2.0 Client ID (Web application)
   - Click edit
   - Add **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     http://127.0.0.1:3000
     https://calisthenx-cajndno7.manus.space
     https://your-custom-domain.com
     ```

8. **Add Authorized Redirect URIs**:
   - In the same OAuth client settings, add **Authorized redirect URIs**:
     ```
     http://localhost:3000/__/auth/handler
     http://127.0.0.1:3000/__/auth/handler
     https://calisthenx-cajndno7.manus.space/__/auth/handler
     https://your-custom-domain.com/__/auth/handler
     ```

### Step 2: Configure Apple Sign-In

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Apple** provider
3. Enable it
4. You'll need:
   - **Services ID**: Create one in Apple Developer account
   - **Team ID**: Your Apple Developer Team ID
   - **Key ID**: From your Apple Developer account
   - **Private Key**: From your Apple Developer account

5. Add your app's domains to Apple Developer account:
   - Go to [Apple Developer](https://developer.apple.com)
   - Register your domain as a Service ID
   - Add domains:
     ```
     localhost
     calisthenx-cajndno7.manus.space
     your-custom-domain.com
     ```

### Step 3: Verify Configuration

After configuration, test sign-in:

1. **Local Development**:
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Click "Sign in with Google" or "Sign in with Apple"
   ```

2. **Production**:
   - Visit your deployed domain
   - Test sign-in flow
   - Check Firebase Console → Authentication → Users to see new users

## Troubleshooting

| Error | Solution |
|-------|----------|
| `auth/configuration-not-found` | Add domain to Authorized domains in Firebase |
| `auth/operation-not-allowed` | Enable provider in Firebase Console |
| `auth/popup-blocked` | App uses redirect flow (no popup) |
| `auth/invalid-api-key` | Check Firebase credentials in `.env.local` |

## Security Notes

⚠️ **Never commit Firebase credentials to Git!**
- Use `.env.local` for local development (already in `.gitignore`)
- Use environment variables in production deployment
- Rotate credentials regularly

## Testing OAuth Locally

For local testing without full OAuth setup:

1. Use **Anonymous Authentication** (temporary)
2. Or use **Email/Password** authentication
3. Or configure localhost as authorized domain

## Next Steps

1. ✅ Configure Google OAuth in Google Cloud Console
2. ✅ Configure Apple OAuth in Apple Developer account
3. ✅ Add authorized domains in Firebase Console
4. ✅ Test sign-in locally
5. ✅ Deploy and test in production
