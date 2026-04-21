import React from 'react';
import { ChevronRight, Lock, CheckCircle2, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SkillPath, UserSkillProgress } from '@/lib/skillPathsSystem';

interface SkillPathCardProps {
  skillPath: SkillPath;
  userProgress: UserSkillProgress;
  onSelectStep: (stepIndex: number) => void;
  onStartTraining: () => void;
}

export function SkillPathCard({
  skillPath,
  userProgress,
  onSelectStep,
  onStartTraining,
}: SkillPathCardProps) {
  const currentStepIndex = Array.isArray(userProgress.completedSteps) ? userProgress.completedSteps.length : 0;
  const progressPercentage = (currentStepIndex / skillPath.steps.length) * 100;
  const currentStep = skillPath.steps[currentStepIndex];
  const daysRemaining = Math.ceil(
    (userProgress.estimatedCompletionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold">{skillPath.skillId}</h3>
            <p className="text-sm text-gray-600">{skillPath.description}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {currentStepIndex + 1}/{skillPath.steps.length}
            </p>
            <p className="text-xs text-gray-500">
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Almost there!'}
            </p>
          </div>
        </div>

        <Progress value={progressPercentage} className="h-2 mb-4" />
      </div>

      {/* Current Step */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2">Current Step</h4>
        <p className="text-sm font-medium mb-1">{currentStep.name}</p>
        <p className="text-xs text-gray-600 mb-3">{currentStep.description}</p>
        <div className="flex gap-2 mb-3">
          {currentStep.tips.slice(0, 2).map((tip, idx) => (
            <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-blue-200">
              {tip}
            </span>
          ))}
        </div>
        <Button
          onClick={onStartTraining}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Start Training This Step
        </Button>
      </div>

      {/* Step Overview */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-3">Progression Path</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {skillPath.steps.map((step, idx) => {
            const isCompleted = idx < userProgress.currentStep;
            const isCurrent = idx === userProgress.currentStep;

            return (
              <button
                key={idx}
                onClick={() => onSelectStep(idx)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-blue-100 border border-blue-300'
                    : isCompleted
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : isCurrent ? (
                    <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{step.name}</p>
                  <p className="text-xs text-gray-500">{step.targetReps || step.targetDuration}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t">
        <div className="text-center">
          <p className="text-xs text-gray-600">Progress</p>
          <p className="text-lg font-bold">{Math.round(progressPercentage)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Started</p>
          <p className="text-lg font-bold">{userProgress.startDate.toLocaleDateString('el-GR', { month: 'short', day: 'numeric' })}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Difficulty</p>
          <p className="text-lg font-bold text-orange-600">{currentStep.difficulty}</p>
        </div>
      </div>
    </Card>
  );
}
