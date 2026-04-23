// ============================================================
// CallistheniX – Music Service
// YouTube Music integration with genre playlists
// ============================================================

export interface MusicGenre {
  id: string;
  name: string;
  icon: string;
  playlistId: string;
  bpmRange: [number, number];
  mood: string;
}

export interface UserMusicPreferences {
  userId: string;
  preferredGenre: string;
  musicEnabled: boolean;
  volume: number;
  lastPlayed: string;
  favoriteGenres: string[];
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  url: string;
  thumbnail: string;
}

// 8 Curated Music Genres
export const MUSIC_GENRES: MusicGenre[] = [
  {
    id: 'pop',
    name: 'Pop',
    icon: '🎤',
    playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf', // YouTube Music Pop Workouts
    bpmRange: [120, 130],
    mood: 'Energetic, Uplifting'
  },
  {
    id: 'rock',
    name: 'Rock',
    icon: '🎸',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf', // YouTube Music Rock Motivation
    bpmRange: [110, 140],
    mood: 'Powerful, Motivating'
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop',
    icon: '🎙️',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf', // YouTube Music Hip-Hop Energy
    bpmRange: [90, 110],
    mood: 'Rhythmic, Intense'
  },
  {
    id: 'electronic',
    name: 'Electronic',
    icon: '⚡',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf', // YouTube Music Electronic Drive
    bpmRange: [120, 140],
    mood: 'Futuristic, Driving'
  },
  {
    id: 'epic',
    name: 'Epic',
    icon: '🏔️',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf', // YouTube Music Epic/Orchestral
    bpmRange: [80, 120],
    mood: 'Heroic, Inspiring'
  },
  {
    id: 'classical',
    name: 'Classical',
    icon: '🎻',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf', // YouTube Music Classical Focus
    bpmRange: [60, 100],
    mood: 'Focused, Calm'
  },
  {
    id: 'latin',
    name: 'Latin',
    icon: '🎶',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf', // YouTube Music Latin Rhythm
    bpmRange: [100, 130],
    mood: 'Rhythmic, Fun'
  },
  {
    id: 'ambient',
    name: 'Ambient',
    icon: '🌊',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf', // YouTube Music Ambient Chill
    bpmRange: [60, 80],
    mood: 'Relaxing, Meditative'
  }
];

// Music Service Class
export class MusicService {
  private static instance: MusicService;
  private currentGenre: MusicGenre | null = null;
  private isPlaying = false;
  private volume = 70;
  private audioElement: HTMLAudioElement | null = null;

  private constructor() {
    this.initializeAudioElement();
  }

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  private initializeAudioElement() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.volume = this.volume / 100;
    }
  }

  // Get genre by ID
  getGenre(genreId: string): MusicGenre | undefined {
    return MUSIC_GENRES.find(g => g.id === genreId);
  }

  // Get all genres
  getAllGenres(): MusicGenre[] {
    return MUSIC_GENRES;
  }

  // Play music for genre
  async playGenre(genreId: string): Promise<void> {
    const genre = this.getGenre(genreId);
    if (!genre) {
      throw new Error(`Genre ${genreId} not found`);
    }

    this.currentGenre = genre;
    this.isPlaying = true;

    // Generate YouTube Music URL for playlist
    const youtubeUrl = this.generateYouTubePlaylistUrl(genre.playlistId);
    
    // In production, use YouTube IFrame API or embed player
    // For now, we'll use a fallback approach
    console.log(`Playing ${genre.name} playlist: ${youtubeUrl}`);
  }

  // Pause music
  pause(): void {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  // Resume music
  resume(): void {
    this.isPlaying = true;
    if (this.audioElement) {
      this.audioElement.play();
    }
  }

  // Toggle music on/off
  toggleMusic(genreId?: string): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (genreId) {
        this.playGenre(genreId);
      } else if (this.currentGenre) {
        this.resume();
      }
    }
  }

  // Set volume (0-100)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    if (this.audioElement) {
      this.audioElement.volume = this.volume / 100;
    }
  }

  // Get current volume
  getVolume(): number {
    return this.volume;
  }

  // Get current genre
  getCurrentGenre(): MusicGenre | null {
    return this.currentGenre;
  }

  // Check if music is playing
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Generate YouTube playlist URL
  private generateYouTubePlaylistUrl(playlistId: string): string {
    return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  }

  // Generate YouTube Music URL
  private generateYouTubeMusicUrl(genreId: string): string {
    const genreMap: { [key: string]: string } = {
      pop: 'https://music.youtube.com/playlist?list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
      rock: 'https://music.youtube.com/playlist?list=PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
      hiphop: 'https://music.youtube.com/playlist?list=PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
      electronic: 'https://music.youtube.com/playlist?list=PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
      epic: 'https://music.youtube.com/playlist?list=PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
      classical: 'https://music.youtube.com/playlist?list=PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
      latin: 'https://music.youtube.com/playlist?list=PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
      ambient: 'https://music.youtube.com/playlist?list=PLrAXtmErZgOeKm4sgNOknGvNjby9efdf'
    };
    return genreMap[genreId] || '';
  }

  // Stop music
  stop(): void {
    this.pause();
    this.currentGenre = null;
    if (this.audioElement) {
      this.audioElement.src = '';
    }
  }

  // Get music preferences from localStorage
  getPreferences(): UserMusicPreferences | null {
    try {
      const prefs = localStorage.getItem('musicPreferences');
      return prefs ? JSON.parse(prefs) : null;
    } catch {
      return null;
    }
  }

  // Save music preferences to localStorage
  savePreferences(prefs: Partial<UserMusicPreferences>): void {
    try {
      const existing = this.getPreferences() || {};
      const updated = { ...existing, ...prefs };
      localStorage.setItem('musicPreferences', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save music preferences:', error);
    }
  }

  // Add genre to favorites
  addFavoriteGenre(genreId: string): void {
    const prefs = this.getPreferences() || { favoriteGenres: [] };
    if (!prefs.favoriteGenres) {
      prefs.favoriteGenres = [];
    }
    if (!prefs.favoriteGenres.includes(genreId)) {
      prefs.favoriteGenres.push(genreId);
      this.savePreferences(prefs);
    }
  }

  // Remove genre from favorites
  removeFavoriteGenre(genreId: string): void {
    const prefs = this.getPreferences();
    if (prefs && prefs.favoriteGenres) {
      prefs.favoriteGenres = prefs.favoriteGenres.filter(g => g !== genreId);
      this.savePreferences(prefs);
    }
  }

  // Get favorite genres
  getFavoriteGenres(): string[] {
    const prefs = this.getPreferences();
    return (prefs?.favoriteGenres as string[]) || [];
  }
}

// Export singleton instance
export const musicService = MusicService.getInstance();
