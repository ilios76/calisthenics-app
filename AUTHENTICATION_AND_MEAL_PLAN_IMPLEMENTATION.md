# CallistheniX: Authentication & Meal Plan Implementation Guide

## Overview

This document provides a comprehensive guide for implementing Google/Apple Sign-In authentication with Firebase, meal plan tiering (7-day free, 30-day premium), and cloud-based progress persistence in CallistheniX.

---

## Part 1: Meal Plan Tiering System

### Architecture

The meal plan system is organized by tier and goal:

**Free Tier (7-Day Plans)**
- 7-day meal plans for each goal (lose_weight, gain_muscle, stay_slim)
- Rotating daily meals to provide variety
- Basic macro tracking
- Perfect for trial users

**Premium Tier (30-Day Plans)**
- 30-day comprehensive meal plans with daily variety
- Macro cycling for optimal results
- Strategic refeed days
- Advanced nutritional guidance

### Implementation Files

#### File: `client/src/lib/mealPlanSystem.ts`

This file contains:

1. **Data Structures**
   - `MealPlan`: Complete meal plan definition
   - `DayMeal`: Daily meal breakdown
   - `MealPlanProgress`: User progress tracking
   - `Meal`: Individual meal details

2. **Free Tier Plans** (7-day)
   - `diet_lose_weight_7day`: Fat loss protocol
   - `diet_gain_muscle_7day`: Muscle building protocol
   - `diet_stay_slim_7day`: Maintenance protocol

3. **Premium Tier Plans** (30-day)
   - `diet_lose_weight_30day`: Advanced fat loss
   - `diet_gain_muscle_30day`: Advanced muscle building
   - `diet_stay_slim_30day`: Advanced maintenance

4. **Helper Functions**
   - `getMealPlanByTierAndGoal()`: Get specific meal plan
   - `getMealPlansByTier()`: Get all plans for tier
   - `calculateDailyMacros()`: Calculate personalized macros
   - `initializeMealPlanProgress()`: Start tracking
   - `updateMealPlanProgress()`: Update progress

### Usage Example

```typescript
import { getMealPlanByTierAndGoal, calculateDailyMacros } from '@/lib/mealPlanSystem';

// Get free tier meal plan
const freePlan = getMealPlanByTierAndGoal('free', 'lose_weight');

// Get premium tier meal plan
const premiumPlan = getMealPlanByTierAndGoal('premium', 'gain_muscle');

// Calculate personalized macros
const macros = calculateDailyMacros(75, 'lose_weight', freePlan);
// Returns: { protein: 262, carbs: 280, fat: 97 }
```

---

## Part 2: Firebase Authentication

### Setup Requirements

#### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select existing
3. Enable Authentication:
   - Google Sign-In
   - Apple Sign-In
4. Enable Firestore Database
5. Create Firestore collections:
   - `users`: User profiles
   - `users/{uid}/workoutProgress`: Workout tracking
   - `users/{uid}/mealPlanProgress`: Meal plan tracking

#### 2. Environment Variables

Create `.env.local` in project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### 3. Google OAuth Configuration

1. Go to Firebase Console → Authentication → Google
2. Add authorized domains:
   - `localhost:3000` (development)
   - `your-domain.com` (production)
3. Create OAuth consent screen in Google Cloud Console

#### 4. Apple Sign-In Configuration

1. Go to Firebase Console → Authentication → Apple
2. Configure Apple Developer Account:
   - Create App ID for your app
   - Create Service ID
   - Create private key
3. Upload Service ID and private key to Firebase

### Implementation Files

#### File: `client/src/services/firebaseAuth.ts`

This file contains:

1. **Firebase Initialization**
   - Initialize Firebase app
   - Initialize Auth and Firestore
   - Handle configuration from environment variables

2. **Authentication Functions**
   - `initializePersistence()`: Set up session persistence
   - `signInWithGoogle()`: Google Sign-In flow
   - `signInWithApple()`: Apple Sign-In flow
   - `signOutUser()`: Sign out
   - `getCurrentUser()`: Get current user
   - `onAuthStateChange()`: Listen to auth state

3. **User Profile Management**
   - `createOrUpdateUserProfile()`: Create/update user
   - `getUserProfile()`: Fetch user profile
   - `updateUserProfile()`: Update user data

4. **Workout Progress Tracking**
   - `getOrCreateWorkoutProgress()`: Initialize workout tracking
   - `updateWorkoutProgress()`: Update workout data
   - `getUserWorkoutProgress()`: Get all workouts

5. **Meal Plan Progress Tracking**
   - `getOrCreateMealPlanProgress()`: Initialize meal plan tracking
   - `updateMealPlanProgress()`: Update meal plan data
   - `getUserMealPlanProgress()`: Get all meal plans

### Usage Example

```typescript
import {
  signInWithGoogle,
  signInWithApple,
  getUserProfile,
  updateUserProfile,
  getOrCreateMealPlanProgress,
  updateMealPlanProgress,
} from '@/services/firebaseAuth';

// Sign in with Google
const user = await signInWithGoogle();

// Get user profile
const profile = await getUserProfile(user.uid);

// Update user profile
await updateUserProfile(user.uid, {
  goal: 'gain_muscle',
  weight: 75,
  tier: 'premium',
});

// Initialize meal plan tracking
const mealProgress = await getOrCreateMealPlanProgress(
  user.uid,
  'diet_lose_weight_30day',
  30
);

// Update meal plan progress
await updateMealPlanProgress(user.uid, 'diet_lose_weight_30day', {
  currentDay: 2,
  completionPercentage: 3,
});
```

---

## Part 3: Firestore Database Schema

### Users Collection

```typescript
users/{uid}
├── uid: string
├── email: string
├── displayName: string
├── photoURL?: string
├── tier: 'free' | 'premium'
├── goal: 'lose_weight' | 'gain_muscle' | 'stay_slim'
├── sex: 'male' | 'female'
├── weight: number
├── age: number
├── height: number
├── createdAt: Timestamp
├── updatedAt: Timestamp
├── authProvider: 'google' | 'apple' | 'email'
└── lastLoginAt: Timestamp
```

### Workout Progress Sub-collection

```typescript
users/{uid}/workoutProgress/{programId}
├── uid: string
├── workoutId: string
├── programId: string
├── currentDay: number
├── currentWeek: number
├── completedWorkouts: number
├── totalWorkouts: number
├── startDate: Timestamp
├── lastWorkoutDate: Timestamp
├── completionPercentage: number
├── exerciseProgress: Record<string, ExerciseProgress>
└── updatedAt: Timestamp
```

### Meal Plan Progress Sub-collection

```typescript
users/{uid}/mealPlanProgress/{mealPlanId}
├── uid: string
├── mealPlanId: string
├── currentDay: number
├── mealsLogged: Record<number, Record<string, boolean>>
├── caloriesLogged: Record<number, number>
├── completionPercentage: number
├── startDate: Timestamp
├── endDate: Timestamp
└── updatedAt: Timestamp
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      
      // Sub-collections
      match /workoutProgress/{document=**} {
        allow read, write: if request.auth.uid == uid;
      }
      
      match /mealPlanProgress/{document=**} {
        allow read, write: if request.auth.uid == uid;
      }
    }
  }
}
```

---

## Part 4: Integration with App

### Step 1: Wrap App with AuthProvider

**File: `client/src/App.tsx`**

```typescript
import { AuthProvider } from '@/components/AuthComponents';

export function App() {
  return (
    <AuthProvider>
      {/* Your app routes */}
    </AuthProvider>
  );
}
```

### Step 2: Add Authentication Routes

**File: `client/src/App.tsx`**

```typescript
import { LoginScreen, UserProfileSetup, ProtectedRoute } from '@/components/AuthComponents';
import { useAuth } from '@/components/AuthComponents';

export function App() {
  const { isAuthenticated, userProfile } = useAuth();

  return (
    <AuthProvider>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={isAuthenticated ? Dashboard : LoginScreen} />
        
        {/* Profile setup route */}
        <Route path="/setup" component={UserProfileSetup} />
        
        {/* Protected routes */}
        <Route path="/dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </Route>
        
        <Route path="/workouts">
          <ProtectedRoute>
            <WorkoutsPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/meal-plans">
          <ProtectedRoute>
            <MealPlansPage />
          </ProtectedRoute>
        </Route>
      </Switch>
    </AuthProvider>
  );
}
```

### Step 3: Display Meal Plans Based on Tier

**File: `client/src/pages/MealPlansPage.tsx`**

```typescript
import { useAuth } from '@/components/AuthComponents';
import { getMealPlansByTier } from '@/lib/mealPlanSystem';

export function MealPlansPage() {
  const { userProfile } = useAuth();

  if (!userProfile) return <div>Loading...</div>;

  // Get meal plans for user's tier
  const mealPlans = getMealPlansByTier(userProfile.tier);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        {userProfile.tier === 'premium' ? '30-Day' : '7-Day'} Meal Plans
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mealPlans.map((plan) => (
          <MealPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
```

---

## Part 5: Deployment Checklist

### Pre-Deployment

- [ ] Set up Firebase project
- [ ] Configure Google OAuth
- [ ] Configure Apple Sign-In
- [ ] Set environment variables
- [ ] Create Firestore collections
- [ ] Set Firestore security rules
- [ ] Test authentication flows locally
- [ ] Test meal plan tiering
- [ ] Test progress persistence

### Firebase Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy
firebase deploy
```

### Environment Variables (Production)

Set in Firebase Console → Project Settings → Environment variables:

```
REACT_APP_FIREBASE_API_KEY=prod_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=prod_domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=prod_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=prod_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
REACT_APP_FIREBASE_APP_ID=prod_app_id
```

---

## Part 6: User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CallistheniX App                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Not Logged In  │
                    └─────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐          ┌──────────────┐
        │Google Sign-In│          │Apple Sign-In │
        └──────────────┘          └──────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    ┌─────────────────────┐
                    │ Create User Profile │
                    │ (Firebase Firestore)│
                    └─────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
        ┌──────────────┐          ┌──────────────┐
        │ Free Tier    │          │Premium Tier  │
        │ 7-Day Plans  │          │ 30-Day Plans │
        └──────────────┘          └──────────────┘
                │                           │
                └─────────────┬─────────────┘
                              ▼
                    ┌─────────────────────┐
                    │ Track Progress      │
                    │ (Firebase Firestore)│
                    └─────────────────────┘
```

---

## Part 7: Key Features

### 1. Seamless Authentication
- **Google Sign-In**: One-click authentication
- **Apple Sign-In**: Privacy-focused authentication
- **Session Persistence**: Remember me functionality
- **Cross-Device Sync**: Progress synced across devices

### 2. Meal Plan Tiering
- **Free Tier**: 7-day rotating meal plans
- **Premium Tier**: 30-day comprehensive meal plans
- **Personalized Macros**: Based on weight, goal, and sex
- **Progress Tracking**: Daily meal logging and analytics

### 3. Data Persistence
- **Cloud Storage**: All data stored in Firebase
- **Real-time Sync**: Changes sync instantly
- **Offline Support**: Local caching for offline access
- **Data Integrity**: Automatic backups and versioning

### 4. User Experience
- **Quick Onboarding**: 4-step profile setup
- **Intuitive Navigation**: Clear tier differentiation
- **Progress Visualization**: Charts and analytics
- **Notifications**: Reminders and achievements

---

## Part 8: Troubleshooting

### Common Issues

**Issue**: Google Sign-In not working
- **Solution**: Check authorized domains in Firebase Console
- **Check**: Ensure `localhost:3000` is added for development

**Issue**: Firebase Firestore permission denied
- **Solution**: Check Firestore security rules
- **Check**: Ensure user UID matches in rules

**Issue**: Meal plan data not persisting
- **Solution**: Verify Firestore collections exist
- **Check**: Check browser console for errors

**Issue**: Apple Sign-In failing
- **Solution**: Verify Apple Developer account setup
- **Check**: Ensure Service ID and private key are correct

---

## Part 9: Future Enhancements

1. **Social Features**
   - Share progress with friends
   - Leaderboards
   - Community challenges

2. **Advanced Analytics**
   - Detailed progress charts
   - Macro tracking trends
   - Workout performance metrics

3. **Personalization**
   - AI-powered meal plan recommendations
   - Adaptive difficulty progression
   - Personalized notifications

4. **Integration**
   - Apple Health sync
   - Google Fit integration
   - Wearable device support

---

## Conclusion

This implementation provides CallistheniX with:

✅ **Secure Authentication**: Google/Apple Sign-In with Firebase
✅ **Meal Plan Tiering**: 7-day free, 30-day premium
✅ **Cloud Persistence**: All user data synced to Firebase
✅ **User Integrity**: Personalized experience with progress tracking
✅ **Scalability**: Firebase handles growth automatically

The system is production-ready and can be deployed immediately with proper Firebase configuration.
