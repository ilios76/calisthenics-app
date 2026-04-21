# CallistheniX – Firebase Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying CallistheniX to Firebase Hosting with authentication and Firestore integration.

---

## Prerequisites

Before deploying, ensure you have:

1. **Firebase Project Created**
   - Project ID: `callisthenix-a7431`
   - Region: `us-central1` (or your preferred region)

2. **Firebase Services Enabled**
   - ✅ Authentication (Google & Apple)
   - ✅ Firestore Database
   - ✅ Hosting

3. **Firebase CLI Installed**
   ```bash
   npm install -g firebase-tools
   ```

4. **Firebase Credentials**
   - API Key: `AIzaSyAoXRGEe5X32rbGH-iWwkKgDaEYIOVo4p4`
   - Auth Domain: `callisthenix-a7431.firebaseapp.com`
   - Project ID: `callisthenix-a7431`
   - Storage Bucket: `callisthenix-a7431.firebasestorage.app`
   - Messaging Sender ID: `236823176042`
   - App ID: `1:236823176042:web:3b18c06632d76b67237b13`

---

## Step 1: Configure Firestore Security Rules

### Access Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `callisthenix-a7431`
3. Go to Firestore Database → Rules

### Set Security Rules

Replace existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      
      // Sub-collections: Workout Progress
      match /workoutProgress/{document=**} {
        allow read, write: if request.auth.uid == uid;
      }
      
      // Sub-collections: Meal Plan Progress
      match /mealPlanProgress/{document=**} {
        allow read, write: if request.auth.uid == uid;
      }
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Publish Rules

1. Click "Publish"
2. Confirm changes

---

## Step 2: Configure Firebase Hosting

### Initialize Firebase Hosting

```bash
cd /home/ubuntu/calisthenics-app
firebase init hosting
```

**Answers:**
- Project: `callisthenix-a7431`
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub deployment: `No` (for now)

### Update firebase.json

Edit `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## Step 3: Build Production Bundle

### Install Dependencies

```bash
cd /home/ubuntu/calisthenics-app
pnpm install
```

### Build for Production

```bash
pnpm build
```

**Expected Output:**
```
✓ 1234 modules transformed.
dist/index.html                   12.34 kB
dist/assets/index-abc123.js       456.78 kB
dist/assets/index-def456.css      12.34 kB
```

### Verify Build

```bash
ls -la dist/
```

Should show:
- `index.html`
- `assets/` directory with JS and CSS files

---

## Step 4: Configure Environment Variables

### Create .env.production

```bash
cat > /home/ubuntu/calisthenics-app/.env.production << EOF
REACT_APP_FIREBASE_API_KEY=AIzaSyAoXRGEe5X32rbGH-iWwkKgDaEYIOVo4p4
REACT_APP_FIREBASE_AUTH_DOMAIN=callisthenix-a7431.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=callisthenix-a7431
REACT_APP_FIREBASE_STORAGE_BUCKET=callisthenix-a7431.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=236823176042
REACT_APP_FIREBASE_APP_ID=1:236823176042:web:3b18c06632d76b67237b13
EOF
```

### Verify Environment Variables

```bash
cat /home/ubuntu/calisthenics-app/.env.production
```

---

## Step 5: Configure Firebase Authentication

### Add Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Go to "Authorized domains" section
3. Add your domain:
   - `callisthenix-a7431.firebaseapp.com` (Firebase default)
   - `calisthenx-cajndno7.manus.space` (Manus custom domain)
   - `localhost:3000` (for local development)

### Google Sign-In Configuration

1. Go to Firebase Console → Authentication → Sign-in method
2. Click "Google"
3. Ensure it's enabled
4. Configure OAuth consent screen in Google Cloud Console

### Apple Sign-In Configuration

1. Go to Firebase Console → Authentication → Sign-in method
2. Click "Apple"
3. Ensure it's enabled
4. Upload Service ID and private key from Apple Developer account

---

## Step 6: Deploy to Firebase Hosting

### Login to Firebase

```bash
firebase login
```

### Deploy

```bash
cd /home/ubuntu/calisthenics-app
firebase deploy
```

**Expected Output:**
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/callisthenix-a7431/overview
Hosting URL: https://callisthenix-a7431.firebaseapp.com
```

### Verify Deployment

1. Visit: https://callisthenix-a7431.firebaseapp.com
2. Verify app loads
3. Test Google Sign-In
4. Test Apple Sign-In
5. Test profile setup
6. Check browser console for errors

---

## Step 7: Configure Custom Domain (Optional)

### Connect Custom Domain

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Enter domain: `calisthenx-cajndno7.manus.space`
4. Follow DNS configuration steps

### Verify Custom Domain

1. Visit: https://calisthenx-cajndno7.manus.space
2. Verify SSL certificate is valid
3. Verify app loads correctly

---

## Step 8: Set Up Continuous Deployment (Optional)

### Connect GitHub Repository

1. Go to Firebase Console → Hosting
2. Click "Connect repository"
3. Select GitHub repository
4. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`

### Enable Auto-Deploy

1. Configure branch to deploy: `main`
2. Enable "Automatic deployments on push"
3. Test by pushing to main branch

---

## Post-Deployment Verification

### Checklist

- [ ] App loads at Firebase URL
- [ ] App loads at custom domain
- [ ] Google Sign-In works
- [ ] Apple Sign-In works
- [ ] Profile setup works
- [ ] Meal plans display
- [ ] Progress persists
- [ ] No console errors
- [ ] No 404 errors
- [ ] SSL certificate is valid

### Test Scenarios

**Scenario 1: New User**
1. Visit app
2. Click "Sign in with Google"
3. Complete OAuth
4. Complete profile setup
5. Verify dashboard loads

**Scenario 2: Returning User**
1. Sign in with same account
2. Verify profile data loads
3. Verify meal plans display
4. Verify progress persists

**Scenario 3: Mobile**
1. Visit app on mobile device
2. Test responsive design
3. Test touch interactions
4. Test sign-in on mobile

---

## Monitoring & Maintenance

### Firebase Console Monitoring

1. Go to Firebase Console → Hosting
2. Monitor:
   - Traffic
   - Build status
   - Deployment history
   - Performance metrics

### View Logs

```bash
firebase functions:log
```

### View Analytics

1. Go to Firebase Console → Analytics
2. Monitor:
   - User engagement
   - Sign-in success rate
   - Error rates

---

## Troubleshooting

### Issue: Deploy Fails with "Permission Denied"

**Solution:**
```bash
firebase login
firebase projects:list
firebase use callisthenix-a7431
firebase deploy
```

### Issue: App Shows Blank Page

**Solution:**
1. Check browser console for errors
2. Verify `dist/index.html` exists
3. Check Firebase Hosting rules
4. Verify environment variables are loaded

### Issue: Sign-In Not Working

**Solution:**
1. Check authorized domains in Firebase Console
2. Verify OAuth configuration
3. Check browser console for error messages
4. Clear browser cache and try again

### Issue: Firestore Errors

**Solution:**
1. Check Firestore security rules
2. Verify user is authenticated
3. Check Firestore quota
4. Monitor Firestore usage in Firebase Console

### Issue: Slow Performance

**Solution:**
1. Enable caching headers in firebase.json
2. Optimize bundle size
3. Use Firebase CDN
4. Monitor performance in Firebase Console

---

## Rollback Procedure

### If Deployment Fails

```bash
# View deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:clone-version <source-version> <target-version>
```

### Manual Rollback

1. Go to Firebase Console → Hosting
2. Click "Releases"
3. Select previous version
4. Click "Rollback"

---

## Performance Optimization

### Enable Compression

Firebase Hosting automatically compresses:
- JavaScript files
- CSS files
- HTML files
- JSON responses

### Cache Strategy

- Static assets (JS, CSS): 1 year cache
- HTML: No cache (always fresh)
- API responses: No cache

### Monitoring

1. Go to Firebase Console → Hosting
2. Monitor:
   - Request latency
   - Bandwidth usage
   - Error rates

---

## Security Best Practices

### Environment Variables

- ✅ Store in `.env.local` (not in git)
- ✅ Never commit `.env` files
- ✅ Use `.env.production` for production values
- ✅ Rotate credentials regularly

### Firebase Security

- ✅ Use strong Firestore security rules
- ✅ Enable 2FA on Firebase account
- ✅ Monitor Firebase Console activity
- ✅ Set up billing alerts

### HTTPS

- ✅ Firebase Hosting uses HTTPS by default
- ✅ All connections are encrypted
- ✅ SSL certificate auto-renews
- ✅ HSTS headers enabled

---

## Support & Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] No console errors
- [ ] Build succeeds
- [ ] Environment variables set
- [ ] Firebase project created
- [ ] Firestore security rules set
- [ ] Authentication configured

### Deployment
- [ ] Firebase CLI installed
- [ ] Logged in to Firebase
- [ ] Build production bundle
- [ ] Deploy to Firebase Hosting
- [ ] Verify deployment successful

### Post-Deployment
- [ ] App loads correctly
- [ ] Authentication works
- [ ] All features tested
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Monitoring configured

---

## Next Steps

1. **Monitor Performance**
   - Set up Firebase Performance Monitoring
   - Monitor user engagement
   - Track error rates

2. **Gather User Feedback**
   - Set up feedback form
   - Monitor user reviews
   - Collect feature requests

3. **Plan Updates**
   - Schedule feature releases
   - Plan performance improvements
   - Plan security updates

4. **Scale Infrastructure**
   - Monitor Firestore usage
   - Optimize queries
   - Plan for growth

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-21 | Initial deployment |

---

**Last Updated:** 2026-04-21  
**Maintained By:** CallistheniX Development Team
