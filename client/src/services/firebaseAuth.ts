// ============================================================
// CallistheniX – Firebase Authentication Service
// Google Sign-In | Apple Sign-In | Progress Persistence
// ============================================================

import {
  initializeApp,
  getApp,
  FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAoXRGEe5X32rbGH-iWwkKgDaEYIOVo4p4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'callisthenix-a7431.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'callisthenix-a7431',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'callisthenix-a7431.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '236823176042',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:236823176042:web:3b18c06632d76b67237b13',
};

// Validate Firebase config
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
  console.error('Firebase configuration is missing or invalid!');
} else {
  console.log('Firebase configuration loaded successfully');
}

// Initialize Firebase
let firebaseApp: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  firebaseApp = getApp();
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
} catch (error) {
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
}

// Enable persistence for better redirect handling
try {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('✅ Firebase persistence enabled (LOCAL)');
    })
    .catch((error) => {
      console.warn('⚠️ Firebase persistence failed:', error);
      // Fallback to session persistence
      return setPersistence(auth, browserSessionPersistence);
    });
} catch (error) {
  console.error('❌ Error setting persistence:', error);
}

// ============================================================
// USER PROFILE INTERFACE
// ============================================================

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tier: 'free' | 'premium';
  goal: 'lose_weight' | 'gain_muscle' | 'stay_slim';
  sex: 'male' | 'female';
  weight: number;
  age: number;
  height: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  authProvider: 'google' | 'apple' | 'email';
  lastLoginAt: Timestamp;
}

export interface WorkoutProgress {
  uid: string;
  workoutId: string;
  programId: string;
  currentDay: number;
  currentWeek: number;
  completedWorkouts: number;
  totalWorkouts: number;
  startDate: Timestamp;
  lastWorkoutDate: Timestamp;
  completionPercentage: number;
  exerciseProgress: Record<string, ExerciseProgress>;
  updatedAt: Timestamp;
}

export interface ExerciseProgress {
  exerciseId: string;
  totalRepsCompleted: number;
  totalSetsCompleted: number;
  formChecksPassed: number;
  formChecksFailed: number;
  averageRepsPerSet: number;
  readyToProgress: boolean;
}

export interface MealPlanProgress {
  uid: string;
  mealPlanId: string;
  currentDay: number;
  mealsLogged: Record<number, Record<string, boolean>>;
  caloriesLogged: Record<number, number>;
  completionPercentage: number;
  startDate: Timestamp;
  endDate: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================
// AUTHENTICATION FUNCTIONS
// ============================================================

/**
 * Initialize persistence (Local or Session)
 */
export async function initializePersistence(rememberMe: boolean = true): Promise<void> {
  try {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
  } catch (error) {
    console.error('Failed to set persistence:', error);
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    console.log('🔵 Google Sign-In: Initializing...');
    console.log('Current hostname:', window.location.hostname);
    console.log('Firebase auth initialized:', !!auth);
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    // Configure custom domain for development
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDevelopment) {
      // For localhost development, we need to configure the provider
      provider.setCustomParameters({
        'prompt': 'select_account'
      });
    }

    // Always use redirect to avoid popup blocking issues
    console.log('🔵 Google Sign-In: Starting redirect...');
    await signInWithRedirect(auth, provider);
    console.log('🔵 Google Sign-In: Redirect initiated');
    return null; // User will be redirected
  } catch (error) {
    console.error('❌ Google sign-in error:', error);
    if (error instanceof Error) {
      console.error('Error code:', (error as any).code);
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

/**
 * Sign in with Apple
 */
export async function signInWithApple(): Promise<User | null> {
  try {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    
    // Configure custom parameters for Apple
    provider.setCustomParameters({
      'locale': 'en'
    });

    // Always use redirect to avoid popup blocking issues
    await signInWithRedirect(auth, provider);
    return null; // User will be redirected
  } catch (error) {
    console.error('Apple sign-in error:', error);
    throw error;
  }
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

// ============================================================
// USER PROFILE FUNCTIONS
// ============================================================

/**
 * Create or update user profile
 */
export async function createOrUpdateUserProfile(
  firebaseUser: User,
  authProvider: 'google' | 'apple' | 'email'
): Promise<UserProfile> {
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    let userProfile: UserProfile;

    if (userSnap.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      userProfile = userSnap.data() as UserProfile;
    } else {
      // Create new user profile
      userProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'User',
        photoURL: firebaseUser.photoURL || undefined,
        tier: 'free',
        goal: 'stay_slim',
        sex: 'male',
        weight: 70,
        age: 25,
        height: 175,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        authProvider,
        lastLoginAt: serverTimestamp() as Timestamp,
      };

      await setDoc(userRef, userProfile);
    }

    return userProfile;
  } catch (error) {
    console.error('Failed to create/update user profile:', error);
    throw error;
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
}

// ============================================================
// WORKOUT PROGRESS FUNCTIONS
// ============================================================

/**
 * Create or get workout progress
 */
export async function getOrCreateWorkoutProgress(
  uid: string,
  programId: string
): Promise<WorkoutProgress> {
  try {
    const progressRef = doc(db, `users/${uid}/workoutProgress`, programId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return progressSnap.data() as WorkoutProgress;
    }

    // Create new progress
    const newProgress: WorkoutProgress = {
      uid,
      workoutId: `${uid}-${programId}`,
      programId,
      currentDay: 1,
      currentWeek: 1,
      completedWorkouts: 0,
      totalWorkouts: 0,
      startDate: serverTimestamp() as Timestamp,
      lastWorkoutDate: serverTimestamp() as Timestamp,
      completionPercentage: 0,
      exerciseProgress: {},
      updatedAt: serverTimestamp() as Timestamp,
    };

    await setDoc(progressRef, newProgress);
    return newProgress;
  } catch (error) {
    console.error('Failed to get/create workout progress:', error);
    throw error;
  }
}

/**
 * Update workout progress
 */
export async function updateWorkoutProgress(
  uid: string,
  programId: string,
  updates: Partial<WorkoutProgress>
): Promise<void> {
  try {
    const progressRef = doc(db, `users/${uid}/workoutProgress`, programId);
    await updateDoc(progressRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to update workout progress:', error);
    throw error;
  }
}

/**
 * Get all workout progress for user
 */
export async function getUserWorkoutProgress(uid: string): Promise<WorkoutProgress[]> {
  try {
  const progressQuery = query(
    collection(db, `users/${uid}/workoutProgress`),
    where('uid', '==', uid)
  );
  const progressSnap = await getDocs(progressQuery);

  return progressSnap.docs.map((doc: any) => doc.data() as WorkoutProgress);
  } catch (error) {
    console.error('Failed to get user workout progress:', error);
    return [];
  }
}

// ============================================================
// MEAL PLAN PROGRESS FUNCTIONS
// ============================================================

/**
 * Create or get meal plan progress
 */
export async function getOrCreateMealPlanProgress(
  uid: string,
  mealPlanId: string,
  duration: number
): Promise<MealPlanProgress> {
  try {
    const progressRef = doc(db, `users/${uid}/mealPlanProgress`, mealPlanId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return progressSnap.data() as MealPlanProgress;
    }

    // Create new progress
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    const newProgress: MealPlanProgress = {
      uid,
      mealPlanId,
      currentDay: 1,
      mealsLogged: {},
      caloriesLogged: {},
      completionPercentage: 0,
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      updatedAt: serverTimestamp() as Timestamp,
    };

    await setDoc(progressRef, newProgress);
    return newProgress;
  } catch (error) {
    console.error('Failed to get/create meal plan progress:', error);
    throw error;
  }
}

/**
 * Update meal plan progress
 */
export async function updateMealPlanProgress(
  uid: string,
  mealPlanId: string,
  updates: Partial<MealPlanProgress>
): Promise<void> {
  try {
    const progressRef = doc(db, `users/${uid}/mealPlanProgress`, mealPlanId);
    await updateDoc(progressRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to update meal plan progress:', error);
    throw error;
  }
}

/**
 * Get all meal plan progress for user
 */
export async function getUserMealPlanProgress(uid: string): Promise<MealPlanProgress[]> {
  try {
  const progressQuery = query(
    collection(db, `users/${uid}/mealPlanProgress`),
    where('uid', '==', uid)
  );
  const progressSnap = await getDocs(progressQuery);

  return progressSnap.docs.map((doc: any) => doc.data() as MealPlanProgress);
  } catch (error) {
    console.error('Failed to get user meal plan progress:', error);
    return [];
  }
}

// ============================================================
// EXPORT FIREBASE INSTANCES
// ============================================================

export { auth, db, firebaseApp };
