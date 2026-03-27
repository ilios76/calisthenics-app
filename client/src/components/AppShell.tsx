// ============================================================
// CallistheniX – AppShell
// Orchestrates all views: onboarding, dashboard, trainer, etc.
// ============================================================
import { useUser } from '@/contexts/UserContext';
import OnboardingPage from '@/pages/Onboarding';
import DashboardPage from '@/pages/Dashboard';
import ProgramsPage from '@/pages/Programs';
import TrainerPage from '@/pages/Trainer';
import DietPage from '@/pages/Diet';
import ProfilePage from '@/pages/Profile';
import ProgressPage from '@/pages/Progress';
import Navbar from '@/components/Navbar';

export default function AppShell() {
  const { currentView, hasProfile } = useUser();

  if (!hasProfile || currentView === 'onboarding') {
    return <OnboardingPage />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.005 285)' }}>
      <Navbar />
      <main className="flex-1">
        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'programs' && <ProgramsPage />}
        {currentView === 'trainer' && <TrainerPage />}
        {currentView === 'diet' && <DietPage />}
        {currentView === 'profile' && <ProfilePage />}
        {currentView === 'progress' && <ProgressPage />}
      </main>
    </div>
  );
}
