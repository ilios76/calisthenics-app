import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BeforeAfterChallenge {
  id: string;
  beforePhoto: string | null; // Base64 or URL
  afterPhoto: string | null;
  beforeDate: Date | null;
  afterDate: Date | null;
  targetDate: Date | null; // 2 months from before date
  completed: boolean;
  shared: boolean;
  shareUrl?: string;
}

interface ChallengeContextType {
  challenge: BeforeAfterChallenge | null;
  initChallenge: () => void;
  setBeforePhoto: (photo: string) => void;
  setAfterPhoto: (photo: string) => void;
  getChallengeDaysRemaining: () => number;
  markAsCompleted: () => void;
  markAsShared: (shareUrl: string) => void;
  resetChallenge: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [challenge, setChallenge] = useState<BeforeAfterChallenge | null>(null);

  // Load challenge from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('beforeAfterChallenge');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        setChallenge({
          ...parsed,
          beforeDate: parsed.beforeDate ? new Date(parsed.beforeDate) : null,
          afterDate: parsed.afterDate ? new Date(parsed.afterDate) : null,
          targetDate: parsed.targetDate ? new Date(parsed.targetDate) : null,
        });
      } catch (e) {
        console.error('Failed to load challenge:', e);
      }
    }
  }, []);

  // Save challenge to localStorage whenever it changes
  useEffect(() => {
    if (challenge) {
      localStorage.setItem('beforeAfterChallenge', JSON.stringify(challenge));
    }
  }, [challenge]);

  const initChallenge = () => {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setMonth(targetDate.getMonth() + 2); // 2 months from now

    const newChallenge: BeforeAfterChallenge = {
      id: `challenge-${Date.now()}`,
      beforePhoto: null,
      afterPhoto: null,
      beforeDate: now,
      afterDate: null,
      targetDate,
      completed: false,
      shared: false,
    };

    setChallenge(newChallenge);
  };

  const setBeforePhoto = (photo: string) => {
    if (challenge) {
      setChallenge({
        ...challenge,
        beforePhoto: photo,
        beforeDate: new Date(),
      });
    }
  };

  const setAfterPhoto = (photo: string) => {
    if (challenge) {
      setChallenge({
        ...challenge,
        afterPhoto: photo,
        afterDate: new Date(),
        completed: true,
      });
    }
  };

  const getChallengeDaysRemaining = (): number => {
    if (!challenge || !challenge.targetDate) return 0;
    const now = new Date();
    const diff = challenge.targetDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const markAsCompleted = () => {
    if (challenge) {
      setChallenge({
        ...challenge,
        completed: true,
      });
    }
  };

  const markAsShared = (shareUrl: string) => {
    if (challenge) {
      setChallenge({
        ...challenge,
        shared: true,
        shareUrl,
      });
    }
  };

  const resetChallenge = () => {
    setChallenge(null);
    localStorage.removeItem('beforeAfterChallenge');
  };

  return (
    <ChallengeContext.Provider
      value={{
        challenge,
        initChallenge,
        setBeforePhoto,
        setAfterPhoto,
        getChallengeDaysRemaining,
        markAsCompleted,
        markAsShared,
        resetChallenge,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenge must be used within ChallengeProvider');
  }
  return context;
};
