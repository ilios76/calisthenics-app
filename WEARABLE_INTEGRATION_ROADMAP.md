# CallistheniX Wearable Integration Roadmap

## Executive Summary

This document outlines the technical architecture and implementation roadmap for integrating CallistheniX with wearable devices (Apple Watch, Fitbit, Garmin). Wearable integration will enable real-time heart rate monitoring, advanced metrics tracking, and enhanced user engagement.

---

## Phase 1: Apple Watch Integration (Months 1-2)

### Architecture Overview

```
CallistheniX App (iPhone/React Native)
    ↓
HealthKit Framework (iOS)
    ↓
Apple Watch (watchOS)
    ↓
Real-time metrics (heart rate, calories, steps)
```

### Implementation Steps

#### Step 1: HealthKit Permissions & Setup

**File**: `client/src/services/healthkit.ts`

```typescript
import { NativeModules } from 'react-native';

const { HealthKitModule } = NativeModules;

export interface HealthKitPermissions {
  readPermissions: string[];
  writePermissions: string[];
}

export const healthKitPermissions: HealthKitPermissions = {
  readPermissions: [
    'HKQuantityTypeIdentifierHeartRate',
    'HKQuantityTypeIdentifierActiveEnergyBurned',
    'HKQuantityTypeIdentifierStepCount',
    'HKQuantityTypeIdentifierDistanceWalkingRunning',
  ],
  writePermissions: [
    'HKWorkoutTypeIdentifier',
    'HKQuantityTypeIdentifierActiveEnergyBurned',
  ],
};

export async function requestHealthKitPermissions(): Promise<boolean> {
  try {
    const granted = await HealthKitModule.requestPermissions(healthKitPermissions);
    return granted;
  } catch (error) {
    console.error('HealthKit permission error:', error);
    return false;
  }
}

export async function isHealthKitAvailable(): Promise<boolean> {
  try {
    return await HealthKitModule.isHealthKitAvailable();
  } catch (error) {
    return false;
  }
}
```

#### Step 2: Workout Session Tracking

**File**: `client/src/services/workoutTracking.ts`

```typescript
import { NativeModules } from 'react-native';

const { WorkoutModule } = NativeModules;

export interface WorkoutSession {
  workoutType: 'Calisthenics' | 'Cardio' | 'Strength';
  startDate: Date;
  endDate: Date;
  duration: number; // seconds
  calories: number;
  heartRate?: {
    average: number;
    min: number;
    max: number;
  };
  exercises: ExerciseLog[];
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps?: number;
  duration?: number;
  heartRate?: number;
  timestamp: Date;
}

export async function startWorkoutSession(
  workoutType: WorkoutSession['workoutType']
): Promise<string> {
  try {
    const sessionId = await WorkoutModule.startWorkout(workoutType);
    return sessionId;
  } catch (error) {
    console.error('Failed to start workout session:', error);
    throw error;
  }
}

export async function endWorkoutSession(
  sessionId: string,
  workout: WorkoutSession
): Promise<void> {
  try {
    await WorkoutModule.endWorkout(sessionId, {
      workoutType: workout.workoutType,
      startDate: workout.startDate.toISOString(),
      endDate: workout.endDate.toISOString(),
      duration: workout.duration,
      calories: workout.calories,
      heartRate: workout.heartRate,
    });
  } catch (error) {
    console.error('Failed to end workout session:', error);
    throw error;
  }
}

export async function logExerciseToHealthKit(
  sessionId: string,
  exercise: ExerciseLog
): Promise<void> {
  try {
    await WorkoutModule.logExercise(sessionId, {
      exerciseId: exercise.exerciseId,
      exerciseName: exercise.exerciseName,
      sets: exercise.sets,
      reps: exercise.reps,
      duration: exercise.duration,
      heartRate: exercise.heartRate,
      timestamp: exercise.timestamp.toISOString(),
    });
  } catch (error) {
    console.error('Failed to log exercise:', error);
    throw error;
  }
}

export async function getHeartRateData(date: Date): Promise<HeartRateData[]> {
  try {
    const data = await WorkoutModule.getHeartRateData(date.toISOString());
    return data;
  } catch (error) {
    console.error('Failed to get heart rate data:', error);
    return [];
  }
}

export interface HeartRateData {
  timestamp: Date;
  heartRate: number;
  zone: 'Zone1' | 'Zone2' | 'Zone3' | 'Zone4' | 'Zone5';
}
```

#### Step 3: Heart Rate Zone Calculation

**File**: `client/src/lib/heartRateZones.ts`

```typescript
export interface HeartRateZones {
  zone1: [number, number]; // 50-60% max HR
  zone2: [number, number]; // 60-70% max HR
  zone3: [number, number]; // 70-80% max HR
  zone4: [number, number]; // 80-90% max HR
  zone5: [number, number]; // 90-100% max HR
}

export function calculateMaxHeartRate(age: number): number {
  // Karvonen formula: 220 - age
  return 220 - age;
}

export function getHeartRateZones(age: number): HeartRateZones {
  const maxHR = calculateMaxHeartRate(age);

  return {
    zone1: [Math.round(maxHR * 0.5), Math.round(maxHR * 0.6)],
    zone2: [Math.round(maxHR * 0.6), Math.round(maxHR * 0.7)],
    zone3: [Math.round(maxHR * 0.7), Math.round(maxHR * 0.8)],
    zone4: [Math.round(maxHR * 0.8), Math.round(maxHR * 0.9)],
    zone5: [Math.round(maxHR * 0.9), maxHR],
  };
}

export function getHeartRateZone(
  heartRate: number,
  zones: HeartRateZones
): 'Zone1' | 'Zone2' | 'Zone3' | 'Zone4' | 'Zone5' {
  if (heartRate >= zones.zone5[0]) return 'Zone5';
  if (heartRate >= zones.zone4[0]) return 'Zone4';
  if (heartRate >= zones.zone3[0]) return 'Zone3';
  if (heartRate >= zones.zone2[0]) return 'Zone2';
  return 'Zone1';
}

export function getZoneDescription(zone: string): string {
  const descriptions: Record<string, string> = {
    Zone1: 'Recovery - Very light intensity',
    Zone2: 'Aerobic - Sustainable pace',
    Zone3: 'Tempo - Moderate intensity',
    Zone4: 'Threshold - Hard intensity',
    Zone5: 'Maximum - All-out effort',
  };
  return descriptions[zone] || 'Unknown';
}
```

#### Step 4: watchOS Companion App

**File**: `client/src/watchos/WatchApp.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { startWorkoutSession, getHeartRateData } from '../services/workoutTracking';

export function WatchApp() {
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (isWorkoutActive && heartRate === null) {
      // Fetch heart rate data every 5 seconds during workout
      const interval = setInterval(async () => {
        const data = await getHeartRateData(new Date());
        if (data.length > 0) {
          setHeartRate(data[data.length - 1].heartRate);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isWorkoutActive, heartRate]);

  async function handleStartWorkout() {
    try {
      const id = await startWorkoutSession('Calisthenics');
      setSessionId(id);
      setIsWorkoutActive(true);
    } catch (error) {
      console.error('Failed to start workout:', error);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isWorkoutActive ? (
        <>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            {heartRate ? `${heartRate} BPM` : 'Loading...'}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 10 }}>Workout Active</Text>
        </>
      ) : (
        <Text onPress={handleStartWorkout} style={{ fontSize: 18 }}>
          Start Workout
        </Text>
      )}
    </View>
  );
}
```

---

## Phase 2: Fitbit Integration (Months 3-4)

### Architecture Overview

```
CallistheniX App
    ↓
Fitbit Web API (OAuth 2.0)
    ↓
Fitbit Device
    ↓
Real-time metrics (heart rate, steps, sleep)
```

### Implementation Steps

#### Step 1: OAuth 2.0 Authentication

**File**: `client/src/services/fitbitAuth.ts`

```typescript
import { NativeModules } from 'react-native';

const { FitbitAuthModule } = NativeModules;

export interface FitbitToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  userId: string;
}

export const FITBIT_CLIENT_ID = process.env.REACT_APP_FITBIT_CLIENT_ID;
export const FITBIT_CLIENT_SECRET = process.env.REACT_APP_FITBIT_CLIENT_SECRET;
export const FITBIT_REDIRECT_URI = 'calisthenix://fitbit-callback';

export async function initiateFitbitAuth(): Promise<string> {
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(FITBIT_REDIRECT_URI)}&scope=activity%20heartrate%20sleep%20profile`;
  return authUrl;
}

export async function exchangeCodeForToken(code: string): Promise<FitbitToken> {
  try {
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: FITBIT_REDIRECT_URI,
      }).toString(),
    });

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to exchange code for token:', error);
    throw error;
  }
}

export async function refreshFitbitToken(refreshToken: string): Promise<FitbitToken> {
  try {
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
      userId: data.user_id,
    };
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
}
```

#### Step 2: Fitbit Data Sync

**File**: `client/src/services/fitbitSync.ts`

```typescript
import { FitbitToken } from './fitbitAuth';

export interface FitbitActivityData {
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  heartRate: number;
}

export interface FitbitSleepData {
  duration: number; // minutes
  startTime: Date;
  endTime: Date;
  efficiency: number; // percentage
}

export async function getFitbitActivityData(
  token: FitbitToken,
  date: Date
): Promise<FitbitActivityData> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    const response = await fetch(
      `https://api.fitbit.com/1/user/${token.userId}/activities/date/${dateStr}.json`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    const data = await response.json();
    const summary = data.summary;

    return {
      steps: summary.steps || 0,
      calories: summary.caloriesBurned || 0,
      distance: summary.distance || 0,
      activeMinutes: summary.fairlyActiveMinutes + summary.veryActiveMinutes || 0,
      heartRate: summary.heartRateZones?.[0]?.max || 0,
    };
  } catch (error) {
    console.error('Failed to get Fitbit activity data:', error);
    throw error;
  }
}

export async function getFitbitSleepData(
  token: FitbitToken,
  date: Date
): Promise<FitbitSleepData | null> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    const response = await fetch(
      `https://api.fitbit.com/1.2/user/${token.userId}/sleep/date/${dateStr}.json`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (!data.sleep || data.sleep.length === 0) return null;

    const sleep = data.sleep[0];
    return {
      duration: sleep.duration,
      startTime: new Date(sleep.startTime),
      endTime: new Date(sleep.endTime),
      efficiency: sleep.efficiency,
    };
  } catch (error) {
    console.error('Failed to get Fitbit sleep data:', error);
    return null;
  }
}

export async function logFitbitExercise(
  token: FitbitToken,
  exercise: {
    name: string;
    duration: number; // minutes
    calories: number;
    date: Date;
  }
): Promise<void> {
  try {
    const dateStr = exercise.date.toISOString().split('T')[0];
    const timeStr = exercise.date.toISOString().split('T')[1].split('.')[0];

    await fetch(`https://api.fitbit.com/1/user/${token.userId}/activities.json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        activityName: exercise.name,
        manualCalories: exercise.calories.toString(),
        durationMillis: (exercise.duration * 60 * 1000).toString(),
        date: dateStr,
        time: timeStr,
      }).toString(),
    });
  } catch (error) {
    console.error('Failed to log Fitbit exercise:', error);
    throw error;
  }
}
```

---

## Phase 3: Garmin Integration (Months 5-6)

### Architecture Overview

```
CallistheniX App
    ↓
Garmin Connect API (OAuth 2.0)
    ↓
Garmin Device
    ↓
Advanced metrics (VO2 max, training load)
```

### Implementation Steps

#### Step 1: Garmin OAuth & Authentication

**File**: `client/src/services/garminAuth.ts`

```typescript
export interface GarminToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userId: string;
}

export const GARMIN_CLIENT_ID = process.env.REACT_APP_GARMIN_CLIENT_ID;
export const GARMIN_CLIENT_SECRET = process.env.REACT_APP_GARMIN_CLIENT_SECRET;
export const GARMIN_REDIRECT_URI = 'calisthenix://garmin-callback';

export async function initiateGarminAuth(): Promise<string> {
  const authUrl = `https://connect.garmin.com/oauthserver/oauth/authorize?response_type=code&client_id=${GARMIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(GARMIN_REDIRECT_URI)}&scope=activity:read_all`;
  return authUrl;
}

export async function exchangeCodeForGarminToken(code: string): Promise<GarminToken> {
  try {
    const response = await fetch('https://connect.garmin.com/oauthserver/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: GARMIN_CLIENT_ID,
        client_secret: GARMIN_CLIENT_SECRET,
        redirect_uri: GARMIN_REDIRECT_URI,
      }).toString(),
    });

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      userId: data.scope.split(' ')[0],
    };
  } catch (error) {
    console.error('Failed to exchange code for Garmin token:', error);
    throw error;
  }
}
```

#### Step 2: Garmin Advanced Metrics

**File**: `client/src/services/garminSync.ts`

```typescript
import { GarminToken } from './garminAuth';

export interface GarminMetrics {
  vo2Max: number;
  trainingLoad: number;
  bodyFat: number;
  weight: number;
  recoveryStatus: 'good' | 'balanced' | 'unbalanced';
}

export async function getGarminMetrics(token: GarminToken): Promise<GarminMetrics> {
  try {
    const response = await fetch(
      'https://connect.garmin.com/usersummary-service/userprofile/v2/userprofile/heartRateVariabilityData',
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    const data = await response.json();
    return {
      vo2Max: data.vo2Max || 0,
      trainingLoad: data.trainingLoad || 0,
      bodyFat: data.bodyFat || 0,
      weight: data.weight || 0,
      recoveryStatus: data.recoveryStatus || 'balanced',
    };
  } catch (error) {
    console.error('Failed to get Garmin metrics:', error);
    throw error;
  }
}
```

---

## Phase 4: UI/UX Implementation (Months 7-8)

### Wearable Dashboard Component

**File**: `client/src/pages/WearableDashboard.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getHeartRateData } from '@/services/workoutTracking';
import { getHeartRateZones, getHeartRateZone } from '@/lib/heartRateZones';

export function WearableDashboard() {
  const [heartRateData, setHeartRateData] = useState<any[]>([]);
  const [zones, setZones] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getHeartRateData(new Date());
      setHeartRateData(data);

      // Assuming age is available from user profile
      const userAge = 30; // TODO: Get from user context
      setZones(getHeartRateZones(userAge));
    }

    loadData();
  }, []);

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Zones</CardTitle>
        </CardHeader>
        <CardContent>
          {zones && (
            <View>
              {Object.entries(zones).map(([zone, [min, max]]) => (
                <View key={zone} className="mb-2 p-2 bg-card rounded">
                  <Text className="font-semibold">{zone}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {min} - {max} BPM
                  </Text>
                </View>
              ))}
            </View>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Today's Heart Rate</CardTitle>
        </CardHeader>
        <CardContent>
          {heartRateData.length > 0 ? (
            <View>
              <Text className="text-2xl font-bold">
                {heartRateData[heartRateData.length - 1].heartRate} BPM
              </Text>
              <Text className="text-sm text-muted-foreground">
                Zone: {heartRateData[heartRateData.length - 1].zone}
              </Text>
            </View>
          ) : (
            <Text className="text-muted-foreground">No data available</Text>
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
```

---

## Implementation Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|-----------------|
| **Phase 1: Apple Watch** | Months 1-2 | HealthKit integration, watchOS app, heart rate tracking |
| **Phase 2: Fitbit** | Months 3-4 | OAuth integration, activity sync, sleep tracking |
| **Phase 3: Garmin** | Months 5-6 | Advanced metrics, VO2 max, training load |
| **Phase 4: UI/UX** | Months 7-8 | Wearable dashboard, notifications, analytics |

---

## Security Considerations

### Token Management
- Store tokens securely using platform-specific secure storage (Keychain on iOS, Keystore on Android)
- Implement token refresh logic before expiration
- Never log or expose tokens in console

### Data Privacy
- Request minimal necessary permissions
- Encrypt sensitive data at rest
- Implement HTTPS for all API calls
- Follow GDPR/CCPA compliance

### API Rate Limiting
- Implement exponential backoff for failed requests
- Cache data locally to reduce API calls
- Batch requests when possible

---

## Conclusion

This wearable integration roadmap provides a structured approach to adding Apple Watch, Fitbit, and Garmin support to CallistheniX. The phased implementation allows for iterative development and testing, with Phase 1 (Apple Watch) providing immediate value and foundation for subsequent integrations.

**Expected Impact**: Enhanced user engagement, real-time metrics, competitive differentiation, and justification for Premium tier pricing.
