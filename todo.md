# CallistheniX - Project TODO

## Core Features (Completed)
- [x] Google Login / Firebase Auth
- [x] Unified Onboarding flow
- [x] Progress Dashboard with streaks
- [x] AI Coach with voice-first interface
- [x] Push Notifications service
- [x] Before/After Challenge
- [x] Achievements system
- [x] AI Coach button drag & drop with touch support

## Monetization & Retention (In Progress)

### 1. Stripe Payment Integration
- [x] Set up Stripe account and API keys
- [x] Create `/api/checkout` endpoint for session generation
- [ ] Implement Stripe webhook handler for payment confirmations
- [x] Create Subscription page with pricing tiers (Free, Pro, Elite)
- [x] Add payment success/failure handling
- [x] Implement subscription status tracking in database
- [ ] Add subscription checks to protected features

### 2. Streak Gamification
- [x] Add visual streak counter (🔥 X days) to Dashboard
- [ ] Add streak counter to Progress page
- [x] Implement milestone notifications (7, 14, 30 days)
- [x] Create streak reset logic (daily check-in required)
- [ ] Add streak statistics to user profile
- [ ] Create streak badges/achievements
- [x] Add visual animations for streak milestones

### 3. Social Sharing for Achievements
- [x] Create achievement sharing modal
- [x] Implement watermark generation with CallistheniX branding
- [x] Add Instagram share functionality
- [x] Add TikTok share functionality
- [x] Create shareable image generation (progress cards, PRs, streaks)
- [x] Add tracking for shared content (analytics)
- [x] Implement referral tracking from shares

## Profile Persistence & Navigation (COMPLETED)
- [x] Extend users table with profile fields (sex, age, weight, height, goal, fitnessLevel)
- [x] Create profile management backend endpoints
- [x] Update Onboarding to save profile to database via tRPC
- [x] Fix logo click to redirect to Dashboard when profile is complete
- [x] Prevent re-entry to Onboarding for authenticated users

## UX Enhancements (COMPLETED)
- [x] Add text-to-speech for coach quotes (speaker button in chat)
- [x] Add text-to-speech for exercise instructions and tips
- [x] Fix calendar to select individual dates instead of all weekday occurrences

## Bug Fixes & Technical Debt
- [ ] Fix Web Speech API TypeScript errors in voiceService.ts
- [ ] Add proper type definitions for SpeechRecognition
- [ ] Implement Stripe webhook handler for payment confirmations
- [ ] Add subscription checks to protected features
- [ ] Optimize bundle size
- [ ] Add error boundary improvements
- [ ] Improve mobile responsiveness

## Future Features
- [ ] Workout library with video demos
- [ ] Nutrition tracking integration
- [ ] Social features (friend challenges, leaderboards)
- [ ] Advanced analytics and insights
- [ ] Offline mode support
- [ ] Dark/Light theme toggle
