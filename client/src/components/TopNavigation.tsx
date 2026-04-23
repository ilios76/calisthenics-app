// CallistheniX – Top Navigation
// Guest-first navigation with profile menu in top-right
// ============================================================

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function TopNavigation() {
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">💪</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">CallistheniX</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate('/')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/programs')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Programs
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </button>
          </div>

          {/* Right Side: Auth/Profile */}
          <div className="flex items-center gap-4">
            {user ? (
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
                        navigate('/dashboard');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        navigate('/settings');
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
              // Not Logged In: Sign In Button
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
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
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => {
                navigate('/programs');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              Programs
            </button>
            <button 
              onClick={() => {
                navigate('/about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-accent rounded-lg transition-colors"
            >
              About
            </button>
            {!user && (
              <Button
                onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-4"
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
