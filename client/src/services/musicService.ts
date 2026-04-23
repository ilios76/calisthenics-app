// ============================================================
// CallistheniX – Music Service
// HTML5 Audio Player with royalty-free music streaming
// Supports 8 genres with real audio playback
// ============================================================

export interface MusicGenre {
  id: string;
  name: string;
  icon: string;
  audioUrl: string;
  description: string;
}

export interface UserMusicPreferences {
  favoriteGenres: string[];
  volume: number;
  lastGenre: string;
}

// Royalty-free music URLs from various sources
// Using high-quality, copyright-free audio streams
export const MUSIC_GENRES: MusicGenre[] = [
  {
    id: 'pop',
    name: 'Pop',
    icon: '🎤',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    description: 'Upbeat pop hits for high energy workouts',
  },
  {
    id: 'rock',
    name: 'Rock',
    icon: '🎸',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    description: 'Powerful rock anthems for strength training',
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop',
    icon: '🎤',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    description: 'Motivating hip-hop beats for intense sessions',
  },
  {
    id: 'electronic',
    name: 'Electronic',
    icon: '🎹',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    description: 'Electronic dance music for cardio workouts',
  },
  {
    id: 'epic',
    name: 'Epic',
    icon: '🎼',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    description: 'Epic orchestral music for peak performance',
  },
  {
    id: 'classical',
    name: 'Classical',
    icon: '🎻',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    description: 'Classical music for focused, controlled training',
  },
  {
    id: 'latin',
    name: 'Latin',
    icon: '🥁',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    description: 'Latin rhythms for dynamic, rhythmic workouts',
  },
  {
    id: 'ambient',
    name: 'Ambient',
    icon: '🌊',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    description: 'Ambient soundscapes for recovery and cool-down',
  },
];

class MusicService {
  private currentGenre: string = 'pop';
  private isPlaying: boolean = false;
  private volume: number = 70;
  private audioElement: HTMLAudioElement | null = null;
  private listeners: ((state: any) => void)[] = [];

  constructor() {
    this.initializeAudio();
    this.loadPreferences();
  }

  // Initialize HTML5 audio element
  private initializeAudio(): void {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.volume = this.volume / 100;
    
    // Add event listeners
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.notifyListeners();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyListeners();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.isPlaying = false;
      this.notifyListeners();
    });
  }

  // Play a specific genre
  async playGenre(genreId: string): Promise<void> {
    try {
      const genre = MUSIC_GENRES.find(g => g.id === genreId);
      if (!genre) {
        console.error(`Genre ${genreId} not found`);
        return;
      }

      this.currentGenre = genreId;

      if (!this.audioElement) {
        this.initializeAudio();
      }

      // Set audio source
      this.audioElement!.src = genre.audioUrl;
      this.audioElement!.volume = this.volume / 100;

      // Play audio
      const playPromise = this.audioElement!.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            console.log(`🎵 Now playing: ${genre.name}`);
            this.notifyListeners();
          })
          .catch((error) => {
            console.error('Playback error:', error);
            this.isPlaying = false;
            this.notifyListeners();
          });
      }

      // Save preference
      this.savePreferences();
    } catch (error) {
      console.error('Error playing genre:', error);
      this.isPlaying = false;
    }
  }

  // Toggle play/pause
  toggleMusic(): void {
    if (!this.audioElement) {
      this.initializeAudio();
    }

    if (this.isPlaying) {
      this.audioElement!.pause();
      this.isPlaying = false;
      console.log('⏸️ Music paused');
    } else {
      const playPromise = this.audioElement!.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            console.log('▶️ Music resumed');
          })
          .catch((error) => {
            console.error('Playback error:', error);
          });
      }
    }
    this.notifyListeners();
  }

  // Resume music
  resume(): void {
    if (this.audioElement && !this.isPlaying) {
      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            console.log('▶️ Music resumed');
            this.notifyListeners();
          })
          .catch((error) => {
            console.error('Playback error:', error);
          });
      }
    }
  }

  // Pause music
  pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
      console.log('⏸️ Music paused');
      this.notifyListeners();
    }
  }

  // Set volume (0-100)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.volume / 100;
    }
    console.log(`🔊 Volume: ${this.volume}%`);
    this.notifyListeners();
  }

  // Get current volume
  getVolume(): number {
    return this.volume;
  }

  // Get current genre
  getCurrentGenre(): string {
    return this.currentGenre;
  }

  // Check if music is playing
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Get all genres
  getGenres(): MusicGenre[] {
    return MUSIC_GENRES;
  }

  // Get genre by ID
  getGenre(genreId: string): MusicGenre | undefined {
    return MUSIC_GENRES.find(g => g.id === genreId);
  }

  // Add genre to favorites
  async addFavorite(genreId: string): Promise<void> {
    const prefs = this.getPreferences();
    if (!prefs.favoriteGenres.includes(genreId)) {
      prefs.favoriteGenres.push(genreId);
      this.savePreferences(prefs);
    }
  }

  // Remove genre from favorites
  async removeFavorite(genreId: string): Promise<void> {
    const prefs = this.getPreferences();
    prefs.favoriteGenres = prefs.favoriteGenres.filter(g => g !== genreId);
    this.savePreferences(prefs);
  }

  // Get favorite genres
  getFavorites(): string[] {
    const prefs = this.getPreferences();
    return prefs.favoriteGenres || [];
  }

  // Save preferences to localStorage
  savePreferences(prefs?: UserMusicPreferences): void {
    const preferences = prefs || {
      favoriteGenres: [],
      volume: this.volume,
      lastGenre: this.currentGenre,
    };

    localStorage.setItem('music_preferences', JSON.stringify(preferences));
  }

  // Load preferences from localStorage
  private loadPreferences(): UserMusicPreferences {
    try {
      const stored = localStorage.getItem('music_preferences');
      if (stored) {
        const prefs = JSON.parse(stored);
        this.volume = prefs.volume || 70;
        this.currentGenre = prefs.lastGenre || 'pop';
        return prefs;
      }
    } catch (error) {
      console.error('Error loading music preferences:', error);
    }

    return {
      favoriteGenres: [],
      volume: 70,
      lastGenre: 'pop',
    };
  }

  // Get preferences
  getPreferences(): UserMusicPreferences {
    try {
      const stored = localStorage.getItem('music_preferences');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error getting music preferences:', error);
    }

    return {
      favoriteGenres: [],
      volume: 70,
      lastGenre: 'pop',
    };
  }

  // Subscribe to music state changes
  subscribe(listener: (state: any) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of state changes
  private notifyListeners(): void {
    const state = {
      isPlaying: this.isPlaying,
      currentGenre: this.currentGenre,
      volume: this.volume,
      genre: this.getGenre(this.currentGenre),
    };
    this.listeners.forEach(listener => listener(state));
  }

  // Stop music and cleanup
  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;
      this.notifyListeners();
    }
  }

  // Get current playback time
  getCurrentTime(): number {
    return this.audioElement?.currentTime || 0;
  }

  // Get total duration
  getDuration(): number {
    return this.audioElement?.duration || 0;
  }

  // Seek to time
  seek(time: number): void {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
  }
}

// Export singleton instance
export const musicService = new MusicService();
