// ============================================================
// CallistheniX – Profile Setup Page
// Complete user profile after first login
// ============================================================

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/firebaseAuth';

export function ProfileSetupPage() {
  const { user, userProfile } = useAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    goal: userProfile?.goal || 'stay_slim',
    sex: userProfile?.sex || 'male',
    weight: userProfile?.weight || 70,
    age: userProfile?.age || 25,
    height: userProfile?.height || 175,
  });

  // Redirect if not authenticated
  if (!user || !userProfile) {
    navigate('/');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      await updateUserProfile(user.uid, {
        goal: formData.goal as any,
        sex: formData.sex as any,
        weight: formData.weight,
        age: formData.age,
        height: formData.height,
      });

      console.log('✓ Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>Help us personalize your training experience</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Training Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal" className="font-medium">
                Training Goal
              </Label>
              <select
                id="goal"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_muscle">Gain Muscle</option>
                <option value="stay_slim">Stay Slim</option>
              </select>
            </div>

            {/* Sex */}
            <div className="space-y-2">
              <Label htmlFor="sex" className="font-medium">
                Sex
              </Label>
              <select
                id="sex"
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="font-medium">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                min="30"
                max="200"
                disabled={isLoading}
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="font-medium">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                min="13"
                max="120"
                disabled={isLoading}
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height" className="font-medium">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                min="100"
                max="250"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full h-11 mt-6">
              {isLoading ? 'Saving...' : 'Continue to Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
