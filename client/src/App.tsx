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
import { FloatingMusicWidget } from "./components/FloatingMusicWidget";
import { CoachProvider } from "./contexts/CoachContext";
import { ChallengeProvider } from "./contexts/ChallengeContext";
import { useEffect } from "react";
import { mealNotificationService } from "./services/mealNotificationService";
import { CoachWidget } from "./components/CoachWidget";
import { VoiceCoachButton } from "./components/VoiceCoachButton";
import { getRedirectResult } from "firebase/auth";
import { auth, createOrUpdateUserProfile } from "./services/firebaseAuth";
import { useUser } from "./contexts/UserContext";

function AppContent() {
  const { setCurrentView } = useUser();

  useEffect(() => {
    // Handle Google OAuth redirect result
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log('User signed in:', result.user.email);
          await createOrUpdateUserProfile(result.user, 'google');
          setCurrentView('onboarding');
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };

    handleRedirectResult();
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
      <FloatingMusicWidget />
      <CoachWidget position="bottom-right" />
      <VoiceCoachButton />
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
