// ============================================================
// CallistheniX – AppShell
// Original flow: Onboarding → Programs → Dashboard
// No login screen - guests start with onboarding
// ============================================================

import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingPage from '@/pages/Onboarding';
import DashboardPage from '@/pages/Dashboard';
import ProgramsPage from '@/pages/Programs';
import TrainerPage from '@/pages/Trainer';
import DietPage from '@/pages/Diet';
import ProfilePage from '@/pages/Profile';
import ProgressPage from '@/pages/Progress';
import SettingsPage from '@/pages/Settings';
import AchievementsPage from '@/pages/Achievements';
import { BeforeAfterChallenge } from '@/pages/BeforeAfterChallenge';
import { TopNavigation } from '@/components/TopNavigation';

export default function AppShell() {
  const { currentView, hasProfile } = useUser();
  const { loading } = useAuth();

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

  // Show onboarding if no profile (guests or new users)
  if (!hasProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopNavigation />
        <main className="flex-1">
          <OnboardingPage />
        </main>
      </div>
    );
  }

  // Show main app with navigation
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.005 285)' }}>
      <TopNavigation />
      <main className="flex-1">
        {currentView === 'onboarding' && <OnboardingPage />}
        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'programs' && <ProgramsPage />}
        {currentView === 'trainer' && <TrainerPage />}
        {currentView === 'diet' && <DietPage />}
        {currentView === 'profile' && <ProfilePage />}
        {currentView === 'progress' && <ProgressPage />}
        {currentView === 'achievements' && <AchievementsPage />}
        {currentView === 'challenge' && <BeforeAfterChallenge />}
        {currentView === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}
