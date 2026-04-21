// ============================================================
// CallistheniX – AppShell
// Orchestrates all views: onboarding, dashboard, trainer, etc.
// ============================================================
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import OnboardingPage from '@/pages/Onboarding';
import DashboardPage from '@/pages/Dashboard';
import ProgramsPage from '@/pages/Programs';
import TrainerPage from '@/pages/Trainer';
import DietPage from '@/pages/Diet';
import ProfilePage from '@/pages/Profile';
import ProgressPage from '@/pages/Progress';
import SettingsPage from '@/pages/Settings';
import Navbar from '@/components/Navbar';

export default function AppShell() {
  const { currentView, hasProfile } = useUser();
  const { isAuthenticated, loading } = useAuth();

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show profile setup if authenticated but profile not complete
  if (!hasProfile) {
    return <ProfileSetupPage />;
  }

  // Show onboarding if needed
  if (currentView === 'onboarding') {
    return <OnboardingPage />;
  }

  // Show main app
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.005 285)' }}>
      <Navbar />
      <main className="flex-1">
        <ProtectedRoute>
          {currentView === 'dashboard' && <DashboardPage />}
          {currentView === 'programs' && <ProgramsPage />}
          {currentView === 'trainer' && <TrainerPage />}
          {currentView === 'diet' && <DietPage />}
          {currentView === 'profile' && <ProfilePage />}
          {currentView === 'progress' && <ProgressPage />}
          {currentView === 'settings' && <SettingsPage />}
        </ProtectedRoute>
      </main>
    </div>
  );
}
