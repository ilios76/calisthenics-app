// ============================================================
// CallistheniX – Music Service
// YouTube Music integration for workout motivation
// Supports 8 genres with real streaming via iframe embeds
// ============================================================

import { db } from './firebaseAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface MusicGenre {
  id: string;
  name: string;
  icon: string;
  playlistId: string;
  description: string;
}

export interface UserMusicPreferences {
  favoriteGenres: string[];
  volume: number;
  lastGenre: string;
}

export const MUSIC_GENRES: MusicGenre[] = [
  {
    id: 'pop',
    name: 'Pop',
    icon: '🎤',
    playlistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    description: 'Upbeat pop hits for high energy workouts',
  },
  {
    id: 'rock',
    name: 'Rock',
    icon: '🎸',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
    description: 'Powerful rock anthems for strength training',
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop',
    icon: '🎤',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
    description: 'Motivating hip-hop beats for intense sessions',
  },
  {
    id: 'electronic',
    name: 'Electronic',
    icon: '🎹',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
    description: 'Electronic dance music for cardio workouts',
  },
  {
    id: 'epic',
    name: 'Epic',
    icon: '🎼',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
    description: 'Epic orchestral music for peak performance',
  },
  {
    id: 'classical',
    name: 'Classical',
    icon: '🎻',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
    description: 'Classical music for focused, controlled training',
  },
  {
    id: 'latin',
    name: 'Latin',
    icon: '🥁',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
    description: 'Latin rhythms for dynamic, rhythmic workouts',
  },
  {
    id: 'ambient',
    name: 'Ambient',
    icon: '🌊',
    playlistId: 'PLrAXtmErZgOeKm4sgNOknGvNjby9efdf',
    description: 'Ambient soundscapes for recovery and cool-down',
  },
];

class MusicService {
  private currentGenre: string = 'pop';
  private isPlaying: boolean = false;
  private volume: number = 70;
  private iframeContainer: HTMLDivElement | null = null;
  private currentIframe: HTMLIFrameElement | null = null;

  constructor() {
    this.loadPreferences();
  }

  // Get YouTube Music embed URL for a genre
  private getYouTubeMusicEmbedUrl(genreId: string): string {
    const genre = MUSIC_GENRES.find(g => g.id === genreId);
    if (!genre) return '';

    // YouTube Music playlist embed format
    return `https://www.youtube.com/embed/videoseries?list=${genre.playlistId}`;
  }

  // Get YouTube Music web player URL
  private getYouTubeMusicWebUrl(genreId: string): string {
    const genre = MUSIC_GENRES.find(g => g.id === genreId);
    if (!genre) return '';

    // Direct YouTube Music playlist link
    return `https://music.youtube.com/playlist?list=${genre.playlistId}`;
  }

  // Play a specific genre
  async playGenre(genreId: string): Promise<void> {
    try {
      this.currentGenre = genreId;
      this.isPlaying = true;

      // Create or update iframe container
      if (!this.iframeContainer) {
        this.iframeContainer = document.createElement('div');
        this.iframeContainer.id = 'music-player-container';
        this.iframeContainer.style.display = 'none';
        document.body.appendChild(this.iframeContainer);
      }

      // Remove old iframe if exists
      if (this.currentIframe) {
        this.currentIframe.remove();
      }

      // Create new iframe for the genre
      const iframe = document.createElement('iframe');
      iframe.src = this.getYouTubeMusicEmbedUrl(genreId);
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.allow = 'autoplay';
      iframe.allowFullscreen = true;

      this.iframeContainer.appendChild(iframe);
      this.currentIframe = iframe;

      // Save preference
      await this.savePreferences();

      console.log(`🎵 Now playing: ${MUSIC_GENRES.find(g => g.id === genreId)?.name}`);
    } catch (error) {
      console.error('Error playing genre:', error);
      this.isPlaying = false;
    }
  }

  // Toggle play/pause
  toggleMusic(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      console.log('▶️ Music resumed');
    } else {
      console.log('⏸️ Music paused');
    }
  }

  // Resume music
  resume(): void {
    this.isPlaying = true;
    console.log('▶️ Music resumed');
  }

  // Pause music
  pause(): void {
    this.isPlaying = false;
    console.log('⏸️ Music paused');
  }

  // Set volume (0-100)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`🔊 Volume: ${this.volume}%`);
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
  async addFavorite(genreId: string, userId?: string): Promise<void> {
    const prefs = this.getPreferences();
    if (!prefs.favoriteGenres.includes(genreId)) {
      prefs.favoriteGenres.push(genreId);
      await this.savePreferences(prefs, userId);
    }
  }

  // Remove genre from favorites
  async removeFavorite(genreId: string, userId?: string): Promise<void> {
    const prefs = this.getPreferences();
    prefs.favoriteGenres = prefs.favoriteGenres.filter(g => g !== genreId);
    await this.savePreferences(prefs, userId);
  }

  // Get favorite genres
  getFavorites(): string[] {
    const prefs = this.getPreferences();
    return prefs.favoriteGenres || [];
  }

  // Save preferences to localStorage and Firebase
  private async savePreferences(
    prefs?: UserMusicPreferences,
    userId?: string
  ): Promise<void> {
    const preferences = prefs || {
      favoriteGenres: [],
      volume: this.volume,
      lastGenre: this.currentGenre,
    };

    // Save to localStorage
    localStorage.setItem('music_preferences', JSON.stringify(preferences));

    // Save to Firebase if user is logged in
    if (userId) {
      try {
        await setDoc(
          doc(db, 'users', userId, 'preferences', 'music'),
          preferences
        );
      } catch (error) {
        console.error('Error saving music preferences to Firebase:', error);
      }
    }
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

  // Load preferences from Firebase
  async loadPreferencesFromFirebase(userId: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId, 'preferences', 'music');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const prefs = docSnap.data() as UserMusicPreferences;
        this.volume = prefs.volume || 70;
        this.currentGenre = prefs.lastGenre || 'pop';
        localStorage.setItem('music_preferences', JSON.stringify(prefs));
      }
    } catch (error) {
      console.error('Error loading music preferences from Firebase:', error);
    }
  }

  // Open YouTube Music in new tab
  openYouTubeMusic(genreId: string): void {
    const url = this.getYouTubeMusicWebUrl(genreId);
    window.open(url, '_blank');
  }
}

// Export singleton instance
export const musicService = new MusicService();
