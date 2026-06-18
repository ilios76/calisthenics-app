// CallistheniX – Top Navigation
// Navigation with profile menu in top-right
// Sign In/Sign Up in profile dropdown for guests
// Uses UserContext setCurrentView for state-driven navigation
// ============================================================

import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Settings, User, LogIn, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle, signInWithApple } from '@/services/firebaseAuth';
import { toast } from 'sonner';

export function TopNavigation() {
  const { setCurrentView, hasProfile } = useUser();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    setCurrentView('onboarding');
  };

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      console.log('Starting Google Sign-In...');
      await signInWithGoogle();
      setProfileMenuOpen(false);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Google Sign-In failed';
      
      // Show user-friendly error messages
      if (errorMessage.includes('unauthorized-domain')) {
        toast.error('This domain is not authorized for Google Sign-In. Please contact support.');
      } else if (errorMessage.includes('operation-not-allowed')) {
        toast.error('Google Sign-In is not enabled. Please contact support.');
      } else if (errorMessage.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Sign-In failed. Please try again.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleAppleSignIn = async () => {
    setSigningIn(true);
    try {
      console.log('Starting Apple Sign-In...');
      await signInWithApple();
      setProfileMenuOpen(false);
    } catch (error) {
      console.error('Apple Sign-In error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Apple Sign-In failed';
      
      // Show user-friendly error messages
      if (errorMessage.includes('unauthorized-domain')) {
        toast.error('This domain is not authorized for Apple Sign-In. Please contact support.');
      } else if (errorMessage.includes('operation-not-allowed')) {
        toast.error('Apple Sign-In is not enabled. Please contact support.');
      } else if (errorMessage.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Sign-In failed. Please try again.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleNavigation = (view: 'onboarding' | 'programs' | 'dashboard') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavigation('onboarding')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">💪</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">CallistheniX</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNavigation('onboarding')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('programs')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Programs
            </button>
            
            {/* Quick Actions Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                Quick Actions
                <Menu size={14} />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-popover border border-border rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button onClick={() => setCurrentView('programs')} className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Browse Programs
                </button>

                <button onClick={() => setCurrentView('stats')} className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Workout Statistics
                </button>
              </div>
            </div>



            <button 
              onClick={() => setCurrentView('dashboard')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </button>
          </div>

          {/* Right Side: Auth/Profile */}
          <div className="flex items-center gap-4">
            {user && hasProfile ? (
              // Logged In: Profile Menu
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">
                    {user.displayName || 'Profile'}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-2">
                    <button
                      onClick={() => {
                        setCurrentView('dashboard');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('settings');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-border my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2 text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not Logged In: Profile Menu with Sign In Option
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors hidden sm:flex"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Account</span>
                </button>

                {/* Guest Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg py-3">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-semibold">Sign In / Sign Up</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Create an account to save your progress
                      </p>
                    </div>

                    <button
                      disabled={signingIn}
                      onClick={handleGoogleSignIn}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-accent flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {signingIn ? "Signing in..." : "Sign in with Google"}
                    </button>

                    <button
                      disabled={signingIn}
                      onClick={handleAppleSignIn}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-accent flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-t border-border"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 13.5c-.91 2.92.37 5.65 2.85 6.75 1.08.44 2.25.48 3.35.13 1.1-.35 2.04-1.05 2.72-1.98.68-.93 1.04-2.04.96-3.2-.08-1.16-.56-2.25-1.3-3.1-.74-.85-1.74-1.38-2.82-1.5-1.08-.12-2.19.16-3.07.78-.88.62-1.48 1.56-1.73 2.62zm-9.05-1.5c0 3.31 2.69 6 6 6s6-2.69 6-6-2.69-6-6-6-6 2.69-6 6zm12-6c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z"/>
                      </svg>
                      {signingIn ? "Signing in..." : "Sign in with Apple"}
                    </button>

                    <div className="px-4 py-2 border-t border-border text-xs text-muted-foreground">
                      <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            <button 
              onClick={() => handleNavigation('onboarding')}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('programs')}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              Programs
            </button>
            <button 
              onClick={() => {setCurrentView('dashboard');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              About
            </button>
            
            {/* Music Widget in Menu */}
            <div className="px-4 py-3 border-t border-border">
              <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                <Music className="w-4 h-4" /> Workout Music
              </div>
              <FloatingMusicWidget />
            </div>
            
            {/* Calendar in Menu */}
            {user && hasProfile && (
              <div className="px-4 py-3 border-t border-border">
                <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Workout Schedule
                </div>
                <div className="bg-card rounded-lg p-3 max-h-96 overflow-y-auto">
                  <WorkoutCalendar />
                </div>
              </div>
            )}
            
            {!user && (
              <Button
                onClick={() => {
                  handleGoogleSignIn();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-4"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
