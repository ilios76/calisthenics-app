// CallistheniX – Landing Page
// Guest-first approach: Browse features, programs, about before sign-in
// ============================================================

import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Zap, Users, Trophy, Smartphone, BookOpen, Heart } from 'lucide-react';

export function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
              <span className="text-4xl">💪</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold">CallistheniX</h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Your Personal Calisthenics Trainer
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master bodyweight exercises with intelligent progression, personalized coaching, and a supportive community. From beginner to advanced skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/programs')}
              className="text-base"
            >
              Explore Programs <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/about')}
              className="text-base"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-background/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose CallistheniX?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Smart Progression */}
            <Card className="border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI-powered progression system that adapts to your performance. Never plateau again with intelligent difficulty scaling.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2: Coach AI */}
            <Card className="border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Personal Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get personalized recommendations based on your performance, recovery, and goals. Like having a trainer in your pocket.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3: 200+ Exercises */}
            <Card className="border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>200+ Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive library of calisthenics exercises with detailed form guides, progressions, and variations.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4: Master Skills */}
            <Card className="border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Master Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learn advanced skills like muscle-ups, handstands, front levers, and planches with structured progression paths.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5: Gamification */}
            <Card className="border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Gamification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Earn streaks, unlock levels, complete challenges, and celebrate achievements. Stay motivated every day.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6: Community */}
            <Card className="border-border/50 hover:border-border transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join thousands of athletes. Share progress, compete on leaderboards, and challenge friends.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Preview Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Popular Programs</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Choose from our curated programs designed for every fitness level
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Program Card 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/programs')}>
              <div className="h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                <span className="text-5xl">🟦</span>
              </div>
              <CardHeader>
                <CardTitle>Beginner Basics</CardTitle>
                <CardDescription>Perfect for starting your journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build foundation strength with fundamental exercises. 6-week program with progressive difficulty.
                </p>
              </CardContent>
            </Card>

            {/* Program Card 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/programs')}>
              <div className="h-32 bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                <span className="text-5xl">🟩</span>
              </div>
              <CardHeader>
                <CardTitle>Muscle Building</CardTitle>
                <CardDescription>Gain strength and size</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hypertrophy-focused program with high volume training. Build impressive physique naturally.
                </p>
              </CardContent>
            </Card>

            {/* Program Card 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/programs')}>
              <div className="h-32 bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                <span className="text-5xl">🟪</span>
              </div>
              <CardHeader>
                <CardTitle>Advanced Skills</CardTitle>
                <CardDescription>Master complex movements</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn muscle-ups, handstands, front levers. For experienced athletes ready for the next level.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/programs')}
              className="text-base"
            >
              View All Programs <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-primary/5 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Transform?</h2>
          <p className="text-lg text-muted-foreground">
            Sign up now to start your calisthenics journey. Track progress, unlock achievements, and join our community.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-base"
          >
            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
