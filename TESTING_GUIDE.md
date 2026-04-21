# CallistheniX – Authentication & Meal Plan Testing Guide

## Overview

This guide provides step-by-step instructions for testing the Firebase authentication system, meal plan tiering, and progress persistence features.

---

## Phase 1: Authentication Testing

### Test 1.1: Google Sign-In Flow

**Steps:**
1. Navigate to the app: https://3000-ir4rq1akmc8r2my2vj0x2-2a006dec.us2.manus.computer
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Verify redirect to profile setup page

**Expected Results:**
- ✅ Google OAuth dialog appears
- ✅ User is authenticated
- ✅ Redirected to `/setup` page
- ✅ Console shows: "✓ Successfully signed in with Google: [User Name]"

**Troubleshooting:**
- If OAuth fails: Check Firebase Console → Authentication → Google → Authorized domains
- Ensure `3000-ir4rq1akmc8r2my2vj0x2-2a006dec.us2.manus.computer` is in authorized domains

### Test 1.2: Apple Sign-In Flow

**Steps:**
1. Navigate to the app
2. Click "Sign in with Apple"
3. Complete Apple OAuth flow
4. Verify redirect to profile setup page

**Expected Results:**
- ✅ Apple OAuth dialog appears
- ✅ User is authenticated
- ✅ Redirected to `/setup` page
- ✅ Console shows: "✓ Successfully signed in with Apple: [User Name]"

**Troubleshooting:**
- If OAuth fails: Check Firebase Console → Authentication → Apple → Service ID and private key

### Test 1.3: Session Persistence

**Steps:**
1. Sign in with Google
2. Complete profile setup
3. Refresh the page
4. Verify user is still logged in

**Expected Results:**
- ✅ User remains authenticated after refresh
- ✅ User profile data is loaded
- ✅ Dashboard is displayed
- ✅ No redirect to login page

**Troubleshooting:**
- If session is lost: Check browser localStorage and sessionStorage
- Verify `initializePersistence()` is called in AuthContext

### Test 1.4: Sign Out

**Steps:**
1. Sign in and complete profile setup
2. Click user menu (top right)
3. Click "Sign Out"
4. Verify redirect to login page

**Expected Results:**
- ✅ User menu dropdown appears
- ✅ "Sign Out" button is visible
- ✅ User is signed out
- ✅ Redirected to login page
- ✅ Console shows: "✓ Signed out successfully"

---

## Phase 2: Profile Setup Testing

### Test 2.1: Profile Completion

**Steps:**
1. Sign in with Google/Apple
2. Complete profile setup form:
   - Select training goal (Lose Weight / Gain Muscle / Stay Slim)
   - Select sex (Male / Female)
   - Enter weight (70 kg)
   - Enter age (25)
   - Enter height (175 cm)
3. Click "Continue to Dashboard"

**Expected Results:**
- ✅ All form fields are editable
- ✅ Form validation works (no empty fields)
- ✅ Profile is saved to Firestore
- ✅ Redirected to dashboard
- ✅ Console shows: "✓ Profile updated successfully!"

**Troubleshooting:**
- If profile not saving: Check Firestore collections exist
- Verify Firestore security rules allow user to write

### Test 2.2: Profile Data Persistence

**Steps:**
1. Complete profile setup
2. Go to Profile Settings
3. Verify all entered data is displayed
4. Refresh page
5. Verify data persists

**Expected Results:**
- ✅ Profile data is saved in Firestore
- ✅ Data persists after page refresh
- ✅ Data is displayed in Profile Settings

---

## Phase 3: Meal Plan Tiering Testing

### Test 3.1: Free Tier Meal Plans (7-Day)

**Steps:**
1. Sign in with a new account
2. Complete profile setup (tier will be "free" by default)
3. Navigate to Nutrition/Diet section
4. Verify 7-day meal plans are displayed

**Expected Results:**
- ✅ User tier is "free"
- ✅ 7-day meal plans are available
- ✅ 30-day meal plans are NOT visible
- ✅ Meal plans are for user's selected goal

**Meal Plans Available:**
- 7-day Lean Fuel (Lose Weight)
- 7-day Muscle Builder (Gain Muscle)
- 7-day Maintenance (Stay Slim)

### Test 3.2: Premium Tier Meal Plans (30-Day)

**Steps:**
1. In Firebase Console, manually update user tier to "premium"
2. Refresh app
3. Navigate to Nutrition/Diet section
4. Verify 30-day meal plans are displayed

**Expected Results:**
- ✅ User tier is "premium"
- ✅ 30-day meal plans are available
- ✅ 7-day meal plans are NOT visible
- ✅ Meal plans are for user's selected goal

**Meal Plans Available:**
- 30-day Comprehensive Fat Loss
- 30-day Comprehensive Muscle Building
- 30-day Comprehensive Maintenance

### Test 3.3: Personalized Macros

**Steps:**
1. Select a meal plan
2. Verify daily macro targets are displayed
3. Check macros are calculated based on:
   - User weight
   - User goal
   - User sex

**Expected Results:**
- ✅ Macros are personalized
- ✅ Protein, carbs, fats are displayed
- ✅ Daily calorie target is shown
- ✅ Macros change based on user profile

---

## Phase 4: Progress Persistence Testing

### Test 4.1: Workout Progress Tracking

**Steps:**
1. Start a workout program
2. Complete exercises and log reps
3. Verify progress is saved to Firestore
4. Refresh page
5. Verify progress persists

**Expected Results:**
- ✅ Workout progress is saved in real-time
- ✅ Progress persists after page refresh
- ✅ Completion percentage updates
- ✅ Exercise metrics are tracked

### Test 4.2: Meal Plan Progress Tracking

**Steps:**
1. Select a meal plan
2. Log meals for the day
3. Verify progress is saved to Firestore
4. Refresh page
5. Verify progress persists

**Expected Results:**
- ✅ Meal plan progress is saved in real-time
- ✅ Progress persists after page refresh
- ✅ Daily completion percentage updates
- ✅ Meal logging is tracked

### Test 4.3: Cross-Device Sync

**Steps:**
1. Sign in on Device A
2. Complete a workout
3. Open app on Device B (same account)
4. Verify workout progress is visible on Device B

**Expected Results:**
- ✅ Progress syncs in real-time across devices
- ✅ No manual refresh needed
- ✅ Latest data is always displayed

---

## Phase 5: Error Handling Testing

### Test 5.1: Network Error Handling

**Steps:**
1. Sign in successfully
2. Disconnect internet
3. Try to complete a workout
4. Reconnect internet
5. Verify data syncs

**Expected Results:**
- ✅ App shows offline indicator
- ✅ Data is cached locally
- ✅ Data syncs when online
- ✅ No data loss

### Test 5.2: Firebase Error Handling

**Steps:**
1. Sign in successfully
2. Temporarily disable Firestore in Firebase Console
3. Try to save workout progress
4. Verify error message is shown
5. Re-enable Firestore
6. Verify retry works

**Expected Results:**
- ✅ Error message is displayed
- ✅ User is informed of the issue
- ✅ Retry mechanism works
- ✅ No data corruption

### Test 5.3: Invalid Profile Data

**Steps:**
1. Try to submit profile form with invalid data:
   - Weight: 0 or > 200
   - Age: < 13 or > 120
   - Height: < 100 or > 250
2. Verify form validation prevents submission

**Expected Results:**
- ✅ Form validation works
- ✅ Error messages are displayed
- ✅ Invalid data cannot be saved

---

## Phase 6: Security Testing

### Test 6.1: Unauthorized Access

**Steps:**
1. Try to access protected routes without authentication:
   - `/dashboard`
   - `/meal-plans`
   - `/progress`
2. Verify redirect to login page

**Expected Results:**
- ✅ Unauthenticated users cannot access protected routes
- ✅ Redirected to login page
- ✅ No data leakage

### Test 6.2: User Data Isolation

**Steps:**
1. Sign in as User A
2. Note user ID from Firestore
3. Sign in as User B (different account)
4. Verify User B cannot see User A's data
5. Check Firestore security rules

**Expected Results:**
- ✅ Users can only access their own data
- ✅ Firestore security rules enforce isolation
- ✅ No cross-user data leakage

### Test 6.3: Token Expiration

**Steps:**
1. Sign in successfully
2. Wait for session to expire (or manually expire token in Firebase)
3. Try to perform an action
4. Verify user is redirected to login

**Expected Results:**
- ✅ Expired tokens are detected
- ✅ User is redirected to login
- ✅ No stale data is displayed

---

## Phase 7: Performance Testing

### Test 7.1: Login Performance

**Steps:**
1. Measure time from clicking "Sign in" to dashboard display
2. Repeat 5 times
3. Calculate average time

**Expected Results:**
- ✅ Average login time < 3 seconds
- ✅ No UI freezing
- ✅ Smooth animations

### Test 7.2: Data Sync Performance

**Steps:**
1. Complete a workout (100+ exercises)
2. Measure time from completion to Firestore update
3. Repeat 5 times
4. Calculate average time

**Expected Results:**
- ✅ Average sync time < 1 second
- ✅ No UI blocking
- ✅ Real-time updates

### Test 7.3: App Load Performance

**Steps:**
1. Clear cache and reload app
2. Measure time from page load to app ready
3. Repeat 5 times
4. Calculate average time

**Expected Results:**
- ✅ Average load time < 5 seconds
- ✅ No blank screens
- ✅ Smooth transitions

---

## Testing Checklist

### Authentication
- [ ] Google Sign-In works
- [ ] Apple Sign-In works
- [ ] Session persistence works
- [ ] Sign out works
- [ ] Error handling works

### Profile Setup
- [ ] Profile form validation works
- [ ] Profile data saves to Firestore
- [ ] Profile data persists after refresh
- [ ] Profile data displays correctly

### Meal Plan Tiering
- [ ] Free tier shows 7-day plans
- [ ] Premium tier shows 30-day plans
- [ ] Personalized macros are calculated
- [ ] Meal plans are goal-specific

### Progress Persistence
- [ ] Workout progress saves
- [ ] Meal plan progress saves
- [ ] Progress persists after refresh
- [ ] Cross-device sync works

### Error Handling
- [ ] Network errors are handled
- [ ] Firebase errors are handled
- [ ] Form validation works
- [ ] Error messages are clear

### Security
- [ ] Protected routes require authentication
- [ ] User data is isolated
- [ ] Token expiration is handled
- [ ] No data leakage

### Performance
- [ ] Login time < 3 seconds
- [ ] Data sync time < 1 second
- [ ] App load time < 5 seconds
- [ ] No UI freezing

---

## Troubleshooting Guide

### Issue: Google Sign-In Not Working

**Solution:**
1. Check Firebase Console → Authentication → Google
2. Verify authorized domains include your app domain
3. Check browser console for error messages
4. Clear browser cache and try again

### Issue: Profile Data Not Saving

**Solution:**
1. Check Firestore collections exist
2. Verify Firestore security rules allow writes
3. Check browser console for error messages
4. Verify user is authenticated

### Issue: Meal Plans Not Displaying

**Solution:**
1. Verify user tier is set correctly in Firestore
2. Check meal plan data is loaded
3. Verify user goal is set in profile
4. Check browser console for errors

### Issue: Progress Not Syncing

**Solution:**
1. Check internet connection
2. Verify Firestore is accessible
3. Check browser console for errors
4. Manually refresh page

### Issue: Session Lost After Refresh

**Solution:**
1. Check browser localStorage is enabled
2. Verify `initializePersistence()` is called
3. Check Firebase auth token is valid
4. Clear browser cache and try again

---

## Deployment Testing

### Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Firebase credentials are correct
- [ ] Firestore security rules are set
- [ ] Google OAuth is configured
- [ ] Apple Sign-In is configured
- [ ] Performance benchmarks met

### Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Authentication works
- [ ] Profile setup works
- [ ] Meal plans display correctly
- [ ] Progress persists
- [ ] No errors in production logs

---

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| Login Time | < 3s | ___ |
| Data Sync Time | < 1s | ___ |
| App Load Time | < 5s | ___ |
| Profile Save Time | < 500ms | ___ |
| Meal Plan Load Time | < 1s | ___ |

---

## Notes

- All tests should be performed in both Chrome and Firefox
- Test on both desktop and mobile devices
- Test with various network speeds (WiFi, 4G, 3G)
- Document any issues found and create bug reports
- Update this guide as new features are added

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Check Firebase Console logs
3. Review Firestore security rules
4. Check network requests in DevTools
5. Contact development team
