// ============================================================
// CallistheniX – Music Service
// YouTube Music Player with 8 genre playlists
// Direct playback with user interaction
// ============================================================

export interface MusicGenre {
  id: string;
  name: string;
  icon: string;
  youtubePlaylistId: string;
  youtubeEmbedUrl: string;
  description: string;
}

export interface UserMusicPreferences {
  favoriteGenres: string[];
  volume: number;
  lastGenre: string;
}

// YouTube Music playlists for each genre
// These are public playlists that can be embedded
export const MUSIC_GENRES: MusicGenre[] = [
  {
    id: 'pop',
    name: 'Pop',
    icon: '🎤',
    youtubePlaylistId: 'Hbq56WnpJeE',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/Hbq56WnpJeE',
    description: '24/7 Pop Music Livestream - Non-stop upbeat hits',
  },
  {
    id: 'rock',
    name: 'Rock',
    icon: '🎸',
    youtubePlaylistId: 'PLrAXtmErZgOd7K2Z1qM5ycUy5eVAP3qIJ',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOd7K2Z1qM5ycUy5eVAP3qIJ',
    description: 'Powerful rock anthems for strength training',
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop',
    icon: '🎤',
    youtubePlaylistId: 'PLrAXtmErZgOdP2svt3qWRaJJUUol5e1S9',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOdP2svt3qWRaJJUUol5e1S9',
    description: 'Motivating hip-hop beats for intense sessions',
  },
  {
    id: 'electronic',
    name: 'Electronic',
    icon: '🎹',
    youtubePlaylistId: 'PLrAXtmErZgOcYNHWmArcNGbiJW91zY1Hy',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOcYNHWmArcNGbiJW91zY1Hy',
    description: 'Electronic dance music for cardio workouts',
  },
  {
    id: 'epic',
    name: 'Epic',
    icon: '🎼',
    youtubePlaylistId: 'PLrAXtmErZgOe3Ycw3kHu7ZHUjJKZAMz8T',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOe3Ycw3kHu7ZHUjJKZAMz8T',
    description: 'Epic orchestral music for peak performance',
  },
  {
    id: 'classical',
    name: 'Classical',
    icon: '🎻',
    youtubePlaylistId: 'PLrAXtmErZgOe3Ycw3kHu7ZHUjJKZAMz8T',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOe3Ycw3kHu7ZHUjJKZAMz8T',
    description: 'Classical music for focused, controlled training',
  },
  {
    id: 'latin',
    name: 'Latin',
    icon: '🥁',
    youtubePlaylistId: 'PLrAXtmErZgOeKC8PPT7Je58otQZIWI93-',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOeKC8PPT7Je58otQZIWI93-',
    description: 'Latin rhythms for dynamic, rhythmic workouts',
  },
  {
    id: 'ambient',
    name: 'Ambient',
    icon: '🌊',
    youtubePlaylistId: 'PLrAXtmErZgOdP2svt3qWRaJJUUol5e1S9',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/videoseries?list=PLrAXtmErZgOdP2svt3qWRaJJUUol5e1S9',
    description: 'Ambient soundscapes for recovery and cool-down',
  },
];

class MusicService {
  private currentGenre: string = 'pop';
  private isPlaying: boolean = false;
  private volume: number = 70;
  private listeners: ((state: any) => void)[] = [];

  constructor() {
    this.loadPreferences();
  }

  // Get YouTube embed URL for genre
  getYouTubeEmbedUrl(genreId: string): string {
    const genre = MUSIC_GENRES.find(g => g.id === genreId);
    if (!genre) return '';
    return genre.youtubeEmbedUrl;
  }

  // Play a specific genre
  playGenre(genreId: string): void {
    const genre = MUSIC_GENRES.find(g => g.id === genreId);
    if (!genre) {
      console.error(`Genre ${genreId} not found`);
      return;
    }

    this.currentGenre = genreId;
    this.isPlaying = true;
    console.log(`🎵 Now playing: ${genre.name}`);
    this.notifyListeners();
    this.savePreferences();
  }

  // Toggle play/pause
  toggleMusic(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      console.log('▶️ Music playing');
    } else {
      console.log('⏸️ Music paused');
    }
    this.notifyListeners();
  }

  // Resume music
  resume(): void {
    this.isPlaying = true;
    console.log('▶️ Music resumed');
    this.notifyListeners();
  }

  // Pause music
  pause(): void {
    this.isPlaying = false;
    console.log('⏸️ Music paused');
    this.notifyListeners();
  }

  // Set volume (0-100)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
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

  // Stop music
  stop(): void {
    this.isPlaying = false;
    console.log('⏹️ Music stopped');
    this.notifyListeners();
  }
}

// Export singleton instance
export const musicService = new MusicService();
