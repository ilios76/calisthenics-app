// ============================================================
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
import { CoachWidget } from "./components/CoachWidget";
import { ChallengeProvider } from "./contexts/ChallengeContext";

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
