// ============================================================
// CallistheniX – User Menu Component
// Dropdown menu with user profile and sign out
// ============================================================

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/services/firebaseAuth';

export function UserMenu() {
  const { user, userProfile } = useAuth();
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  async function handleSignOut() {
    try {
      await signOutUser();
      console.log('✓ Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  if (!user || !userProfile) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-muted transition-colors"
      >
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span className="text-sm font-medium hidden sm:inline">{user.displayName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
            {/* User Info */}
            <div className="p-4 border-b border-border">
              <p className="text-sm font-medium text-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tier: <span className="font-semibold">{userProfile.tier === 'premium' ? '⭐ Premium' : 'Free'}</span>
              </p>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                📋 Profile Settings
              </button>
              <button
                onClick={() => {
                  navigate('/progress');
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                📊 My Progress
              </button>
              <button
                onClick={() => {
                  navigate('/meal-plans');
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
              >
                🍽️ Meal Plans
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
