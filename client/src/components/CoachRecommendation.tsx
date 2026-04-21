import React from 'react';
import { AlertCircle, Lightbulb, Trophy, Heart, Zap, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CoachRecommendation as CoachRecommendationType } from '@/lib/coachAISystem';

interface CoachRecommendationProps {
  recommendation: CoachRecommendationType;
  onAction: (actionType: string) => void;
  onDismiss: () => void;
}

export function CoachRecommendation({
  recommendation,
  onAction,
  onDismiss,
}: CoachRecommendationProps) {
  const getIcon = () => {
    const type = recommendation.type as string;
    if (type.includes('decline')) return <AlertCircle className="w-6 h-6 text-red-500" />;
    if (type.includes('plateau')) return <Zap className="w-6 h-6 text-orange-500" />;
    if (type.includes('streak')) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (type.includes('recovery')) return <Heart className="w-6 h-6 text-pink-500" />;
    if (type.includes('motivation')) return <Lightbulb className="w-6 h-6 text-blue-500" />;
    if (type.includes('goal')) return <Target className="w-6 h-6 text-purple-500" />;
    return <Lightbulb className="w-6 h-6 text-blue-500" />;
  };

  const getPriorityColor = () => {
    if (recommendation.priority === 'high') return 'border-red-200 bg-red-50';
    if (recommendation.priority === 'medium') return 'border-yellow-200 bg-yellow-50';
    if (recommendation.priority === 'low') return 'border-blue-200 bg-blue-50';
    return 'border-gray-200 bg-gray-50';
  };

  const getPriorityBadge = () => {
    if (recommendation.priority === 'high')
      return <span className="text-xs font-semibold px-2 py-1 bg-red-200 text-red-800 rounded">High Priority</span>;
    if (recommendation.priority === 'medium')
      return <span className="text-xs font-semibold px-2 py-1 bg-yellow-200 text-yellow-800 rounded">Medium Priority</span>;
    if (recommendation.priority === 'low')
      return <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded">Tip</span>;
    return null;
  };

  return (
    <Card className={`p-4 border-2 ${getPriorityColor()}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{recommendation.title}</h3>
            {getPriorityBadge()}
          </div>
          <p className="text-sm text-gray-700 mb-3">{recommendation.message}</p>



          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => onAction(recommendation.type)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              size="sm"
            >
              Take Action
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
