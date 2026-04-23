import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, ChevronRight } from 'lucide-react';
import { musicService, MUSIC_GENRES } from '@/services/musicService';

interface MusicPlayerProps {
  compact?: boolean;
}

export function MusicPlayer({ compact = false }: MusicPlayerProps) {
  const [currentGenre, setCurrentGenre] = useState('pop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [showGenreSelector, setShowGenreSelector] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const unsubscribe = musicService.subscribe((state: any) => {
      setCurrentGenre(state.currentGenre);
      setIsPlaying(state.isPlaying);
      setVolume(state.volume);
    });

    return unsubscribe;
  }, []);

  const handlePlayGenre = (genreId: string) => {
    musicService.playGenre(genreId);
    setCurrentGenre(genreId);
    setIsPlaying(true);
    setShowGenreSelector(false);
    // Force iframe reload
    setIframeKey(prev => prev + 1);
  };

  const handleToggleMusic = () => {
    musicService.toggleMusic();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    musicService.setVolume(newVolume);
    setVolume(newVolume);
  };

  const currentGenreData = MUSIC_GENRES.find(g => g.id === currentGenre);
  const embedUrl = musicService.getYouTubeEmbedUrl(currentGenre);

  if (compact) {
    return (
      <div
        className="rounded p-4"
        style={{ background: 'oklch(0.15 0.006 285)', border: '1px solid oklch(1 0 0 / 8%)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="cx-section-title text-lg" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            WORKOUT MUSIC
          </h3>
          <button
            onClick={() => setShowGenreSelector(!showGenreSelector)}
            className="cx-label flex items-center gap-1"
            style={{ fontSize: '0.7rem', cursor: 'pointer', color: 'oklch(0.68 0.18 142)' }}
          >
            Change <ChevronRight size={12} />
          </button>
        </div>

        {/* Current Genre Display */}
        <div className="mb-4">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.65 0.008 80)', marginBottom: '8px' }}>
            Now Playing:
          </p>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'oklch(0.90 0.008 80)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {currentGenreData?.name} {currentGenreData?.icon}
          </p>
        </div>

        {/* Play Button */}
        <button
          onClick={handleToggleMusic}
          className="w-full flex items-center justify-center gap-2 py-3 rounded"
          style={{
            background: isPlaying ? 'oklch(0.68 0.18 142)' : 'oklch(0.50 0.008 80)',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        {/* Volume Control */}
        <div className="mt-4 flex items-center gap-3">
          <Volume2 size={16} style={{ color: 'oklch(0.68 0.18 142)' }} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1"
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)', minWidth: '30px' }}>
            {volume}%
          </span>
        </div>

        {/* Genre Selector */}
        {showGenreSelector && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {MUSIC_GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => handlePlayGenre(genre.id)}
                className="p-3 rounded text-left transition-colors"
                style={{
                  background: currentGenre === genre.id ? 'oklch(0.68 0.18 142)' : 'oklch(0.20 0.006 285)',
                  color: currentGenre === genre.id ? 'white' : 'oklch(0.85 0.008 80)',
                  border: currentGenre === genre.id ? 'none' : '1px solid oklch(1 0 0 / 8%)',
                  cursor: 'pointer',
                }}
              >
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {genre.icon} {genre.name}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* YouTube Embed */}
        {embedUrl && isPlaying && (
          <div style={{ marginTop: '16px', borderRadius: '4px', overflow: 'hidden' }}>
            <iframe
              key={iframeKey}
              width="100%"
              height="60"
              src={`${embedUrl}&autoplay=1`}
              title="YouTube Music Player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
        )}
      </div>
    );
  }

  // Full player view
  return (
    <div
      className="rounded p-6"
      style={{ background: 'oklch(0.15 0.006 285)', border: '1px solid oklch(1 0 0 / 8%)' }}
    >
      <h2 className="cx-section-title text-2xl mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
        WORKOUT MUSIC
      </h2>

      {/* Current Genre */}
      <div className="mb-6">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.65 0.008 80)', marginBottom: '12px' }}>
          Now Playing:
        </p>
        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '2rem', color: 'oklch(0.90 0.008 80)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {currentGenreData?.name} {currentGenreData?.icon}
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.55 0.008 80)', marginTop: '8px' }}>
          {currentGenreData?.description}
        </p>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handleToggleMusic}
        className="w-full flex items-center justify-center gap-3 py-4 rounded mb-6"
        style={{
          background: isPlaying ? 'oklch(0.68 0.18 142)' : 'oklch(0.50 0.008 80)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        {isPlaying ? 'PAUSE MUSIC' : 'PLAY MUSIC'}
      </button>

      {/* YouTube Embed */}
      {embedUrl && isPlaying && (
        <div style={{ marginBottom: '24px', borderRadius: '4px', overflow: 'hidden' }}>
          <iframe
            key={iframeKey}
            width="100%"
            height="100"
            src={`${embedUrl}&autoplay=1`}
            title="YouTube Music Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        </div>
      )}

      {/* Volume Control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'oklch(0.90 0.008 80)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Volume
          </label>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'oklch(0.55 0.008 80)' }}>
            {volume}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full"
          style={{ cursor: 'pointer' }}
        />
      </div>

      {/* Genre Selector */}
      <div>
        <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'oklch(0.90 0.008 80)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Select Genre
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {MUSIC_GENRES.map(genre => (
            <button
              key={genre.id}
              onClick={() => handlePlayGenre(genre.id)}
              className="p-4 rounded text-left transition-all"
              style={{
                background: currentGenre === genre.id ? 'oklch(0.68 0.18 142)' : 'oklch(0.20 0.006 285)',
                color: currentGenre === genre.id ? 'white' : 'oklch(0.85 0.008 80)',
                border: currentGenre === genre.id ? 'none' : '1px solid oklch(1 0 0 / 8%)',
                cursor: 'pointer',
                transform: currentGenre === genre.id ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {genre.icon} {genre.name}
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: currentGenre === genre.id ? 'rgba(255,255,255,0.8)' : 'oklch(0.55 0.008 80)', marginTop: '4px' }}>
                {genre.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
