import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface MusicPlayerProps {
  compact?: boolean;
}

export function MusicPlayer({ compact = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  // YouTube livestream ID
  const LIVESTREAM_ID = 'Hbq56WnpJeE';

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value));
  };

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
        </div>

        {/* Now Playing Info */}
        <div className="mb-4">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.65 0.008 80)', marginBottom: '8px' }}>
            Now Playing:
          </p>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'oklch(0.90 0.008 80)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🎤 24/7 POP LIVESTREAM
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)', marginTop: '4px' }}>
            Non-stop upbeat hits
          </p>
        </div>

        {/* Play Button */}
        <button
          onClick={handlePlayPause}
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
          {isPlaying ? (
            <>
              <Pause size={18} />
              PAUSE
            </>
          ) : (
            <>
              <Play size={18} />
              PLAY
            </>
          )}
        </button>

        {/* YouTube Embed - Hidden when not playing */}
        {isPlaying && (
          <div className="mt-4">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${LIVESTREAM_ID}?autoplay=1&controls=1`}
              title="24/7 Pop Music Livestream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '4px' }}
            />
          </div>
        )}

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

        {/* Status indicator */}
        {isPlaying && (
          <div style={{ marginTop: '12px', padding: '8px', borderRadius: '4px', background: 'oklch(0.68 0.18 142 / 0.2)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.68 0.18 142)', fontWeight: 700 }}>
              🎵 MUSIC PLAYING
            </p>
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
          🎤 24/7 POP LIVESTREAM
        </p>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.55 0.008 80)', marginTop: '8px' }}>
          Non-stop upbeat pop music - 24 hours a day, 7 days a week
        </p>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
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
        {isPlaying ? (
          <>
            <Pause size={20} />
            PAUSE MUSIC
          </>
        ) : (
          <>
            <Play size={20} />
            PLAY MUSIC
          </>
        )}
      </button>

      {/* YouTube Embed - Shows when playing */}
      {isPlaying && (
        <div className="mb-6">
          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${LIVESTREAM_ID}?autoplay=1&controls=1`}
            title="24/7 Pop Music Livestream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: '4px' }}
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

      {/* Status */}
      {isPlaying && (
        <div style={{ padding: '16px', borderRadius: '4px', background: 'oklch(0.68 0.18 142 / 0.2)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'oklch(0.68 0.18 142)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🎵 MUSIC PLAYING - ENJOY YOUR WORKOUT!
          </p>
        </div>
      )}
    </div>
  );
}
