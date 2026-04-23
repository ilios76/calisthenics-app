// CallistheniX – Music Player Component
// Genre selector with play/pause and volume controls
// ============================================================

import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { musicService, MUSIC_GENRES, MusicGenre } from '@/services/musicService';

interface MusicPlayerProps {
  compact?: boolean;
  onGenreChange?: (genreId: string) => void;
}

export function MusicPlayer({ compact = false, onGenreChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | null>(null);
  const [showGenreSelector, setShowGenreSelector] = useState(false);

  useEffect(() => {
    // Load saved preferences
    try {
      const prefs = musicService.getPreferences();
      if (prefs && prefs.lastGenre) {
        const genre = musicService.getGenre(prefs.lastGenre);
        if (genre) {
          setSelectedGenre(genre);
        } else {
          // Default to pop if saved genre not found
          const popGenre = musicService.getGenre('pop');
          if (popGenre) {
            setSelectedGenre(popGenre);
          }
        }
      } else {
        // Default to pop
        const popGenre = musicService.getGenre('pop');
        if (popGenre) {
          setSelectedGenre(popGenre);
        }
      }
      setVolume(prefs?.volume || 70);
    } catch (error) {
      console.error('Error loading music preferences:', error);
      // Default to pop
      const popGenre = musicService.getGenre('pop');
      if (popGenre) {
        setSelectedGenre(popGenre);
      }
    }
  }, []);

  const handlePlayPause = async () => {
    if (!selectedGenre) {
      // Play default genre (Pop)
      const popGenre = musicService.getGenre('pop');
      if (popGenre) {
        setSelectedGenre(popGenre);
        await musicService.playGenre('pop');
        setIsPlaying(true);
      }
    } else {
      musicService.toggleMusic();
      setIsPlaying(!isPlaying);
    }
  };

  const handleGenreSelect = async (genre: MusicGenre) => {
    setSelectedGenre(genre);
    setShowGenreSelector(false);
    await musicService.playGenre(genre.id);
    setIsPlaying(true);
    onGenreChange?.(genre.id);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    musicService.setVolume(newVolume);
  };

  if (compact) {
    // Compact mode for floating player
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg p-4 flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="text-white hover:opacity-80 transition-opacity"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white" />
            )}
          </button>

          {/* Current Genre Display */}
          {selectedGenre && (
            <div className="flex items-center gap-2 text-white">
              <span className="text-xl">{selectedGenre.icon}</span>
              <span className="text-sm font-medium">{selectedGenre.name}</span>
            </div>
          )}

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3) ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          {/* Genre Selector Toggle */}
          <button
            onClick={() => setShowGenreSelector(!showGenreSelector)}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <Music className="w-5 h-5" />
          </button>
        </div>

        {/* Genre Selector Dropdown */}
        {showGenreSelector && (
          <div className="absolute bottom-20 right-0 bg-popover border border-border rounded-lg shadow-lg p-3 w-64">
            <p className="text-sm font-semibold mb-3">Choose Music Genre</p>
            <div className="grid grid-cols-2 gap-2">
              {MUSIC_GENRES && MUSIC_GENRES.length > 0 ? (
                MUSIC_GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreSelect(genre)}
                    className={`p-3 rounded-lg transition-all text-center ${
                      selectedGenre?.id === genre.id
                        ? 'bg-primary text-white'
                        : 'bg-accent hover:bg-accent/80'
                    }`}
                  >
                    <div className="text-xl mb-1">{genre.icon}</div>
                    <div className="text-xs font-medium">{genre.name}</div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground col-span-2">No genres available</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full mode for dashboard/settings
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">Workout Music</h3>
        </div>
        <button
          onClick={handlePlayPause}
          className="bg-primary text-white rounded-full p-3 hover:bg-primary/90 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-white" />
          ) : (
            <Play className="w-6 h-6 fill-white" />
          )}
        </button>
      </div>

      {/* Current Genre */}
      {selectedGenre && (
        <div className="bg-accent/50 rounded-lg p-4 flex items-center gap-3">
          <span className="text-4xl">{selectedGenre.icon}</span>
          <div>
            <p className="font-semibold">{selectedGenre.name}</p>
            <p className="text-sm text-muted-foreground">{selectedGenre.description}</p>
          </div>
        </div>
      )}

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Volume</label>
          <span className="text-sm text-muted-foreground">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Genre Selector */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Choose Genre</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MUSIC_GENRES && MUSIC_GENRES.length > 0 ? (
            MUSIC_GENRES.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreSelect(genre)}
                className={`p-3 rounded-lg transition-all text-center ${
                  selectedGenre?.id === genre.id
                    ? 'bg-primary text-white'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                <div className="text-2xl mb-1">{genre.icon}</div>
                <div className="text-xs font-medium">{genre.name}</div>
              </button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-4">No genres available</p>
          )}
        </div>
      </div>
    </div>
  );
}
