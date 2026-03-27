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
import ErrorBoundary from "./components/ErrorBoundary";
import AppShell from "./components/AppShell";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
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
              </UserProvider>
            </ProgressProvider>
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
