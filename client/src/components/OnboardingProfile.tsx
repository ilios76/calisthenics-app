// ============================================================
// CallistheniX – Onboarding Profile Form
// Collects user profile data after Google sign-in
// ============================================================

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/firebaseAuth';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

export const OnboardingProfile: React.FC = () => {
  const { user } = useAuth();
  const { setCurrentView, setHasProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: 25,
    weight: 70,
    height: 175,
    sex: 'male' as 'male' | 'female',
    goal: 'gain_muscle' as 'lose_weight' | 'gain_muscle' | 'stay_slim',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      // Update user profile with form data
      await updateUserProfile(user.uid, {
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        sex: formData.sex,
        goal: formData.goal,
      });

      toast.success('Profile created successfully!');
      setHasProfile(true);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.68 0.18 142)' }}>
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Help us personalize your training experience
          </p>
        </div>

        {/* User Info Display */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="font-semibold">{user?.displayName || user?.email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="16"
              max="100"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium mb-2">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="30"
              max="200"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="140"
              max="220"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-medium mb-2">Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium mb-2">Primary Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="lose_weight">Lose Weight</option>
              <option value="gain_muscle">Gain Muscle</option>
              <option value="stay_slim">Stay Slim</option>
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6"
            style={{
              background: 'oklch(0.68 0.18 142)',
              color: 'white',
            }}
          >
            {loading ? 'Saving...' : 'Continue to Dashboard'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          You can update these settings later in your profile
        </p>
      </div>
    </div>
  );
};
