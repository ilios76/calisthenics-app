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
import StatisticsPage from '@/pages/Statistics';
import { BeforeAfterChallenge } from '@/pages/BeforeAfterChallenge';
import { TopNavigation } from '@/components/TopNavigation';
import { OnboardingProfile } from '@/components/OnboardingProfile';

export default function AppShell() {
  const { currentView, hasProfile } = useUser();
  const { loading, user } = useAuth();

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

  // Show profile form if user is authenticated but has no profile
  if (user && !hasProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopNavigation />
        <main className="flex-1">
          <OnboardingProfile />
        </main>
      </div>
    );
  }

  // Show onboarding if no user and no profile (guests)
  if (!user && !hasProfile) {
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
        {currentView === 'stats' && <StatisticsPage />}
      </main>
    </div>
  );
}
