// ============================================================
// CallistheniX – AppShell
// Guest-first routing: Landing → Programs → Auth → Dashboard
// ============================================================

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { LandingPage } from '@/pages/LandingPage';
import { ProgramsPage } from '@/pages/ProgramsPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfileSetupPage } from '@/pages/ProfileSetupPage';
import { TopNavigation } from '@/components/TopNavigation';
import DashboardPage from '@/pages/Dashboard';
import TrainerPage from '@/pages/Trainer';
import DietPage from '@/pages/Diet';
import ProfilePage from '@/pages/Profile';
import ProgressPage from '@/pages/Progress';
import SettingsPage from '@/pages/Settings';

type Route = 'landing' | 'programs' | 'about' | 'auth' | 'setup' | 'dashboard' | 'trainer' | 'diet' | 'profile' | 'progress' | 'settings';

export default function AppShell() {
  const { isAuthenticated, loading } = useAuth();
  const { currentView, hasProfile } = useUser();
  const [route, setRoute] = useState<Route>('landing');

  // Handle routing logic
  useEffect(() => {
    if (loading) return;

    // If not authenticated, show guest routes
    if (!isAuthenticated) {
      if (route === 'auth' || route === 'setup') {
        setRoute('auth');
      } else if (route.startsWith('dashboard') || route === 'trainer' || route === 'diet' || route === 'profile' || route === 'progress' || route === 'settings') {
        // Redirect protected routes to landing
        setRoute('landing');
      }
      return;
    }

    // If authenticated but no profile, show setup
    if (!hasProfile && route !== 'setup') {
      setRoute('setup');
      return;
    }

    // If authenticated with profile, allow dashboard routes
    if (hasProfile && (route === 'auth' || route === 'setup')) {
      setRoute('dashboard');
    }
  }, [isAuthenticated, hasProfile, loading, route]);

  // Show loading screen
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

  // Guest routes (no auth required)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopNavigation />
        <main className="flex-1">
          {route === 'landing' && <LandingPage />}
          {route === 'programs' && <ProgramsPage />}
          {route === 'auth' && <LoginPage />}
        </main>
      </div>
    );
  }

  // Auth required: show setup if needed
  if (!hasProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopNavigation />
        <main className="flex-1">
          <ProfileSetupPage />
        </main>
      </div>
    );
  }

  // Authenticated with profile: show dashboard
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.005 285)' }}>
      <TopNavigation />
      <main className="flex-1">
        {route === 'dashboard' && <DashboardPage />}
        {route === 'trainer' && <TrainerPage />}
        {route === 'diet' && <DietPage />}
        {route === 'profile' && <ProfilePage />}
        {route === 'progress' && <ProgressPage />}
        {route === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}
