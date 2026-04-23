import React from 'react';
import { Music, Pause, Play } from 'lucide-react';
import { useMusicContext } from '@/contexts/MusicContext';

export const FloatingMusicWidget: React.FC = () => {
  const { isPlaying, togglePlay } = useMusicContext();

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={togglePlay}
        className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
          isPlaying
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8 text-white" fill="white" />
        ) : (
          <>
            <Music className="w-8 h-8 text-white absolute" />
            <Play className="w-6 h-6 text-white fill-white" />
          </>
        )}
      </button>
    </div>
  );
};
