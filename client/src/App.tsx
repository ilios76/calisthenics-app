// ============================================================
// CallistheniX – Main App
// Industrial Athletic / Raw Power design system
// Dark charcoal base, electric orange accent, Barlow Condensed
// ============================================================
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AppShell from "./components/AppShell";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
