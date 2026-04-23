import React, { useState } from 'react';
import { Music, Pause, Play, Volume2 } from 'lucide-react';
import { useMusicContext } from '@/contexts/MusicContext';

export const FloatingMusicWidget: React.FC = () => {
  const { isPlaying, togglePlay, volume, setVolume, currentGenre, setGenre } = useMusicContext();
  const [showGenreMenu, setShowGenreMenu] = useState(false);

  const genres = ['pop', 'rock', 'hiphop', 'electronic', 'epic', 'classical', 'latin', 'ambient'];

  const handleGenreSelect = (genre: string) => {
    setGenre(genre);
    setShowGenreMenu(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Genre menu */}
      {showGenreMenu && (
        <div className="absolute bottom-20 right-0 bg-gray-800 rounded-lg shadow-lg p-3 mb-2 w-40">
          <div className="text-xs text-gray-400 mb-2 font-semibold">SELECT GENRE</div>
          <div className="grid grid-cols-2 gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  currentGenre === genre
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main music button */}
      <div className="flex flex-col items-center gap-2">
        {/* Genre selector button */}
        <button
          onClick={() => setShowGenreMenu(!showGenreMenu)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 shadow-lg transition-all duration-300"
          title="Select Genre"
        >
          <Music className="w-6 h-6 text-white" />
        </button>

        {/* Play/Pause button */}
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
            <Play className="w-8 h-8 text-white fill-white" />
          )}
        </button>
      </div>

      {/* Current genre indicator */}
      <div className="absolute bottom-0 right-0 text-xs text-gray-400 mt-2 text-center w-16">
        {currentGenre.charAt(0).toUpperCase() + currentGenre.slice(1)}
      </div>
    </div>
  );
}
