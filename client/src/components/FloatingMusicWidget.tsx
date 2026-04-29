import React, { useState } from 'react';
import { Music, Pause, Play } from 'lucide-react';
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
    <div className="fixed top-20 right-8 z-50">
      {/* Genre menu */}
      {showGenreMenu && (
        <div className="absolute bottom-20 right-0 rounded-lg shadow-lg p-3 mb-2 w-40" style={{ background: 'oklch(0.15 0.006 285)', border: '1px solid oklch(0.68 0.18 142 / 30%)' }}>
          <div style={{ fontSize: '0.75rem', color: 'oklch(0.65 0.008 80)', marginBottom: '8px', fontWeight: 600, fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>SELECT GENRE</div>
          <div className="grid grid-cols-2 gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className="px-2 py-1 text-xs rounded transition-colors"
                style={{
                  background: currentGenre === genre ? 'oklch(0.68 0.18 142)' : 'oklch(0.12 0.005 285)',
                  color: currentGenre === genre ? 'oklch(0.10 0.005 285)' : 'oklch(0.65 0.008 80)',
                  border: '1px solid oklch(1 0 0 / 10%)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                }}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main music button */}
      <div className="flex flex-col items-center gap-3">
        {/* Genre selector button */}
        <button
          onClick={() => setShowGenreMenu(!showGenreMenu)}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          style={{
            background: 'oklch(0.68 0.18 142 / 20%)',
            border: '2px solid oklch(0.68 0.18 142)',
            color: 'oklch(0.68 0.18 142)',
          }}
          title="Select Genre"
        >
          <Music className="w-6 h-6" />
        </button>

        {/* Play/Pause toggle button - Green slide toggle */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          style={{
            width: '64px',
            height: '36px',
            background: isPlaying ? 'oklch(0.68 0.18 142)' : 'oklch(0.12 0.005 285)',
            border: '2px solid oklch(0.68 0.18 142)',
            position: 'relative',
          }}
          title={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {/* Slide indicator */}
          <div
            style={{
              position: 'absolute',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isPlaying ? 'oklch(0.10 0.005 285)' : 'oklch(0.68 0.18 142)',
              left: isPlaying ? '4px' : '32px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" style={{ color: 'oklch(0.68 0.18 142)' }} fill="currentColor" />
            ) : (
              <Play className="w-4 h-4" style={{ color: 'oklch(0.10 0.005 285)' }} fill="currentColor" />
            )}
          </div>
        </button>
      </div>

      {/* Current genre indicator */}
      <div style={{ fontSize: '0.75rem', color: 'oklch(0.65 0.008 80)', marginTop: '8px', textAlign: 'center', width: '64px', fontFamily: 'DM Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {currentGenre.charAt(0).toUpperCase() + currentGenre.slice(1)}
      </div>
    </div>
  );
};
