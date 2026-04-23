import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  currentGenre: string;
  setGenre: (genre: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// YouTube Music 24/7 livestreams for different genres
const MUSIC_STREAMS: Record<string, string> = {
  pop: 'Hbq56WnpJeE',
  rock: 'jfKfPfyJRdk',
  hiphop: 'gKkohHMVDKs',
  electronic: 'Xw-m4jEY-Ns',
  epic: 'ZLpSvnVP94M',
  classical: 'Xw-m4jEY-Ns',
  latin: 'gKkohHMVDKs',
  ambient: 'ZLpSvnVP94M',
};

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGenre, setCurrentGenre] = useState('pop');
  const [volume, setVolume] = useState(0.7);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const play = () => {
    setIsPlaying(true);
    if (iframeRef.current) {
      // Send postMessage to YouTube iframe to play
      iframeRef.current.style.display = 'block';
    }
    console.log(`Playing ${currentGenre} music`);
  };

  const pause = () => {
    setIsPlaying(false);
    if (iframeRef.current) {
      iframeRef.current.style.display = 'none';
    }
    console.log('Music paused');
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setGenre = (genre: string) => {
    setCurrentGenre(genre);
    if (isPlaying) {
      // If music is playing, switch to new genre
      if (iframeRef.current) {
        const videoId = MUSIC_STREAMS[genre] || MUSIC_STREAMS.pop;
        iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&fs=0`;
      }
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay, play, pause, currentGenre, setGenre, volume, setVolume, iframeRef }}>
      {/* Hidden YouTube iframe for in-app music playback */}
      <div style={{ display: 'none' }}>
        <iframe
          ref={iframeRef}
          width="0"
          height="0"
          src={`https://www.youtube.com/embed/${MUSIC_STREAMS.pop}?autoplay=0&controls=0&modestbranding=1&rel=0&fs=0`}
          title="Music Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
};
