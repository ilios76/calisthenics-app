// CallistheniX – Programs Page
// Browse all programs (guest accessible)
// ============================================================

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Lock } from 'lucide-react';

const PROGRAMS = [
  {
    id: 1,
    title: 'Beginner Basics',
    description: 'Perfect for starting your journey',
    difficulty: 'Beginner',
    duration: '6 weeks',
    workouts: 18,
    color: 'from-blue-500/20 to-blue-600/20',
    features: ['Foundation strength', 'Basic exercises', 'Progressive difficulty'],
    requiresAuth: false,
  },
  {
    id: 2,
    title: 'Muscle Building',
    description: 'Gain strength and size',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    workouts: 24,
    color: 'from-green-500/20 to-green-600/20',
    features: ['Hypertrophy focus', 'High volume training', 'Nutrition guide'],
    requiresAuth: true,
  },
  {
    id: 3,
    title: 'Advanced Skills',
    description: 'Master complex movements',
    difficulty: 'Advanced',
    duration: '12 weeks',
    workouts: 36,
    color: 'from-purple-500/20 to-purple-600/20',
    features: ['Muscle-ups', 'Handstands', 'Front levers'],
    requiresAuth: true,
  },
  {
    id: 4,
    title: 'Fat Loss Protocol',
    description: 'Burn fat while preserving muscle',
    difficulty: 'Intermediate',
    duration: '4 weeks',
    workouts: 12,
    color: 'from-red-500/20 to-red-600/20',
    features: ['Calorie deficit', 'HIIT workouts', 'Meal plans'],
    requiresAuth: true,
  },
  {
    id: 5,
    title: 'Strength Foundation',
    description: 'Build raw strength',
    difficulty: 'Beginner',
    duration: '8 weeks',
    workouts: 24,
    color: 'from-orange-500/20 to-orange-600/20',
    features: ['Compound movements', 'Progressive overload', 'Form focus'],
    requiresAuth: false,
  },
  {
    id: 6,
    title: 'Calisthenics Master',
    description: 'Complete bodyweight mastery',
    difficulty: 'Advanced',
    duration: '16 weeks',
    workouts: 48,
    color: 'from-pink-500/20 to-pink-600/20',
    features: ['All skills', 'Competition prep', 'Advanced techniques'],
    requiresAuth: true,
  },
];

export function ProgramsPage() {
  const [, navigate] = useLocation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredPrograms = selectedDifficulty
    ? PROGRAMS.filter(p => p.difficulty === selectedDifficulty)
    : PROGRAMS;

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSelectProgram = (program: typeof PROGRAMS[0]) => {
    if (program.requiresAuth) {
      navigate('/auth');
    } else {
      // Navigate to program details
      navigate(`/program/${program.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <section className="px-4 py-12 bg-background/50 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">All Programs</h1>
          <p className="text-lg text-muted-foreground">
            Choose a program that matches your fitness level and goals
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedDifficulty === null ? 'default' : 'outline'}
              onClick={() => setSelectedDifficulty(null)}
              size="sm"
            >
              All Programs
            </Button>
            {difficulties.map(difficulty => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                onClick={() => setSelectedDifficulty(difficulty)}
                size="sm"
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map(program => (
              <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                {/* Program Header */}
                <div className={`h-32 bg-gradient-to-br ${program.color} flex items-center justify-center relative`}>
                  {program.requiresAuth && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Premium
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Program Content */}
                <CardHeader>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  {/* Program Info */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Difficulty</p>
                      <p className="font-semibold">{program.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Duration</p>
                      <p className="font-semibold">{program.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Workouts</p>
                      <p className="font-semibold">{program.workouts}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Includes:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {program.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <Button
                    onClick={() => handleSelectProgram(program)}
                    className="w-full"
                    variant={program.requiresAuth ? 'outline' : 'default'}
                  >
                    {program.requiresAuth ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Sign Up to Access
                      </>
                    ) : (
                      <>
                        View Details <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 bg-primary/5 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground">
            Sign up to unlock premium programs, track your progress, and get personalized coaching
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
          >
            Sign Up Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
