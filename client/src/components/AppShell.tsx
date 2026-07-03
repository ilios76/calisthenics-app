// ============================================================
// CallistheniX – AppShell  (UNIFIED v2)
//
// Routing logic (simple):
//   loading          → spinner
//   no profile       → OnboardingPage  (handles both guest & auth)
//   has profile      → main app
// ============================================================

import { useUser }    from '@/contexts/UserContext';
import { useAuth }    from '@/contexts/AuthContext';
import OnboardingPage from '@/pages/Onboarding';
import DashboardPage  from '@/pages/Dashboard';
import ProgramsPage   from '@/pages/Programs';
import TrainerPage    from '@/pages/Trainer';
import DietPage       from '@/pages/Diet';
import ProfilePage    from '@/pages/Profile';
import ProgressPage   from '@/pages/Progress';
import ProgressDashboard from '@/pages/ProgressDashboard';
import SettingsPage   from '@/pages/Settings';
import AchievementsPage from '@/pages/Achievements';
import StatisticsPage from '@/pages/Statistics';
import { BeforeAfterChallenge } from '@/pages/BeforeAfterChallenge';
import { TopNavigation } from '@/components/TopNavigation';

export default function AppShell() {
  const { currentView, hasProfile } = useUser();
  const { loading } = useAuth();

  // ── Auth loading ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.10 0.005 285)' }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'oklch(0.68 0.18 142)' }} />
          <p className="text-sm" style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  // ── No profile yet → Onboarding (handles both guest & auth) ─
  if (!hasProfile) {
    return <OnboardingPage />;
  }

  // ── Main app ────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.005 285)' }}>
      <TopNavigation />
      <main className="flex-1">
        {currentView === 'onboarding'    && <OnboardingPage />}
        {currentView === 'dashboard'     && <DashboardPage />}
        {currentView === 'programs'      && <ProgramsPage />}
        {currentView === 'trainer'       && <TrainerPage />}
        {currentView === 'diet'          && <DietPage />}
        {currentView === 'profile'       && <ProfilePage />}
        {currentView === 'progress'      && <ProgressDashboard />}
        {currentView === 'achievements'  && <AchievementsPage />}
        {currentView === 'challenge'     && <BeforeAfterChallenge />}
        {currentView === 'settings'      && <SettingsPage />}
        {currentView === 'stats'         && <StatisticsPage />}
      </main>
    </div>
  );
}
