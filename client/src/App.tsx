// CallistheniX – Main App
// Industrial Athletic / Raw Power design system
// Dark charcoal base, light green accent, Barlow Condensed
// ============================================================
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { I18nProvider } from "./contexts/I18nContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MusicProvider } from "./contexts/MusicContext";
import { WorkoutCompletionProvider } from "./contexts/WorkoutCompletionContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AppShell from "./components/AppShell";

import { CoachProvider } from "./contexts/CoachContext";
import { ChallengeProvider } from "./contexts/ChallengeContext";
import { useEffect } from "react";
import { mealNotificationService } from "./services/mealNotificationService";
import { CoachWidget } from "./components/CoachWidget";

import { onAuthStateChanged } from "firebase/auth";
import { auth, createOrUpdateUserProfile } from "./services/firebaseAuth";
import { useUser } from "./contexts/UserContext";

function AppContent() {
  const { setCurrentView } = useUser();

  useEffect(() => {
    // Listen to auth state changes (handles redirect results automatically)
    console.log('🔵 App.tsx: Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          console.log('✅ Auth state changed - User signed in:', user.email);
          console.log('Provider data:', user.providerData);
          console.log('🔵 Detecting auth provider...');
          
          const authProvider = user.providerData[0]?.providerId.includes('apple') ? 'apple' : 'google';
          console.log('Auth provider detected:', authProvider);
          
          console.log('🔵 Creating/updating user profile...');
          await createOrUpdateUserProfile(user, authProvider);
          console.log('✅ User profile created/updated');
          
          // Don't force onboarding - let AppShell handle the view based on hasProfile
          console.log('✅ Auth state listener complete - AppShell will handle view routing');
        } else {
          console.log('ℹ️ Auth state changed - No user signed in');
        }
      } catch (error) {
        console.error('❌ Auth state handler error:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error code:', (error as any).code);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setCurrentView]);

  useEffect(() => {
    // Initialize meal notifications on app load
    mealNotificationService.requestNotificationPermission().then(granted => {
      if (granted) {
        mealNotificationService.scheduleMealNotifications();
      }
    });
  }, []);

  return (
    <>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: 'oklch(0.15 0.006 285)',
            border: '1px solid oklch(1 0 0 / 10%)',
            color: 'oklch(0.96 0.008 80)',
          },
        }}
      />
      <AppShell />
      <CoachWidget position="bottom-right" />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ChallengeProvider>
          <CoachProvider>
            <WorkoutCompletionProvider>
              <MusicProvider>
                <ThemeProvider>
                  <I18nProvider>
                    <TooltipProvider>
                      <ProgressProvider>
                        <UserProvider>
                          <AppContent />
                        </UserProvider>
                      </ProgressProvider>
                    </TooltipProvider>
                  </I18nProvider>
                </ThemeProvider>
              </MusicProvider>
            </WorkoutCompletionProvider>
          </CoachProvider>
        </ChallengeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
