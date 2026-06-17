// CallistheniX – Login Page
// Google Sign-In with popup (fallback to redirect)
// ============================================================

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  signInWithGoogle,
  initializePersistence,
  createOrUpdateUserProfile,
} from '@/services/firebaseAuth';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '@/services/firebaseAuth';

export function LoginPage() {
  const [, navigate] = useLocation();
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle redirect result (only runs if we fell back to signInWithRedirect)
  useEffect(() => {
    let cancelled = false;

    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (cancelled) return;

        if (result?.user) {
          console.log('✓ Signed in after redirect:', result.user.displayName);
          await createOrUpdateUserProfile(result.user, 'google');
          navigate('/setup');
        }
        // result === null just means no pending redirect — that's normal
      } catch (err: any) {
        if (cancelled) return;
        const code = err?.code ?? '';

        // Ignore "no redirect pending" — it's not an error
        if (
          code === 'auth/no-auth-event' ||
          code === 'auth/redirect-cancelled-by-user'
        ) {
          return;
        }

        console.error('Redirect result error:', err);
        setError(friendlyError(err));
      }
    };

    handleRedirectResult();
    return () => { cancelled = true; };
  }, [navigate]);

  async function handleGoogleSignIn() {
    try {
      setIsLoading(true);
      setError(null);
      await initializePersistence(rememberMe);

      const user = await signInWithGoogle();

      // Popup succeeded → user is set immediately
      if (user) {
        await createOrUpdateUserProfile(user, 'google');
        navigate('/setup');
      }
      // If user is null → redirect was initiated, page will reload
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(friendlyError(err));
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">💪</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">CallistheniX</CardTitle>
          <CardDescription className="text-base">Your Personal Calisthenics Trainer</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 text-base font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading ? 'Signing in…' : 'Sign in with Google'}
          </Button>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
              Keep me signed in
            </Label>
          </div>

          {/* Terms & Privacy */}
          <p className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-foreground">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Helper ────────────────────────────────────────────────────────────────

function friendlyError(err: any): string {
  const code: string = err?.code ?? '';
  const map: Record<string, string> = {
    'auth/popup-blocked':
      'Your browser blocked the sign-in popup. Please allow popups for this site and try again.',
    'auth/popup-closed-by-user':
      'The sign-in window was closed before completing. Please try again.',
    'auth/cancelled-popup-request':
      'Another sign-in attempt is in progress. Please wait a moment.',
    'auth/network-request-failed':
      'Network error. Please check your connection and try again.',
    'auth/too-many-requests':
      'Too many sign-in attempts. Please wait a few minutes and try again.',
    'auth/unauthorized-domain':
      'This domain is not authorized for Google Sign-In. Please contact support.',
    'auth/configuration-not-found':
      'Firebase is not configured for this domain. Please contact support.',
  };
  return map[code] ?? `Sign-in failed (${code || err?.message ?? 'unknown error'}). Please try again.`;
}
