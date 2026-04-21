import React from 'react';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressionAction } from '@/lib/autoProgressionSystem';

interface ProgressionCardProps {
  action: ProgressionAction;
  exerciseName: string;
  currentLevel: number;
  onDismiss: () => void;
  onAccept: () => void;
}

export function ProgressionCard({
  action,
  exerciseName,
  currentLevel,
  onDismiss,
  onAccept,
}: ProgressionCardProps) {
  const getIcon = () => {
    switch (action.type) {
      case 'progression':
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'deload':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'variation_suggest':
        return <Zap className="w-6 h-6 text-orange-500" />;
      default:
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (action.type) {
      case 'progression':
        return 'bg-green-50 border-green-200';
      case 'deload':
        return 'bg-yellow-50 border-yellow-200';
      case 'variation_suggest':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className={`p-4 border-2 ${getBackgroundColor()}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{action.message}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {exerciseName} • Level {currentLevel}
          </p>
          <p className="text-sm mb-4">{action.message}</p>
          <div className="flex gap-2">
            <Button
              onClick={onAccept}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              Apply Change
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
