// ============================================================
// CallistheniX – Offline Mode System
// Local caching, sync queue, and offline support
// ============================================================

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';
export type DataType = 'workout' | 'progress' | 'profile' | 'share' | 'challenge';

// ============================================================
// Offline Workout
// ============================================================

export interface OfflineWorkout {
  workoutId: string;
  userId: string;
  timestamp: Date;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    reps: number;
    sets: number;
    duration?: number;
    completed: boolean;
    notes?: string;
  }[];
  totalDuration: number; // minutes
  notes?: string;
  synced: boolean;
  syncedAt?: Date;
  syncStatus: SyncStatus;
  syncError?: string;
}

export interface OfflineProgress {
  progressId: string;
  userId: string;
  type: 'exercise' | 'skill' | 'challenge';
  targetId: string; // exercise ID, skill ID, or challenge ID
  progress: number;
  timestamp: Date;
  synced: boolean;
  syncStatus: SyncStatus;
}

// ============================================================
// Sync Queue
// ============================================================

export interface SyncQueueItem {
  id: string;
  dataType: DataType;
  data: any;
  timestamp: Date;
  retries: number;
  maxRetries: number;
  status: SyncStatus;
  error?: string;
}

export class SyncQueue {
  private queue: SyncQueueItem[] = [];
  private syncing = false;

  /**
   * Add item to sync queue
   */
  addItem(dataType: DataType, data: any): SyncQueueItem {
    const item: SyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      dataType,
      data,
      timestamp: new Date(),
      retries: 0,
      maxRetries: 3,
      status: 'pending',
    };

    this.queue.push(item);
    return item;
  }

  /**
   * Get pending items
   */
  getPendingItems(): SyncQueueItem[] {
    return this.queue.filter(item => item.status === 'pending');
  }

  /**
   * Get failed items
   */
  getFailedItems(): SyncQueueItem[] {
    return this.queue.filter(item => item.status === 'failed');
  }

  /**
   * Update item status
   */
  updateItemStatus(id: string, status: SyncStatus, error?: string): void {
    const item = this.queue.find(i => i.id === id);
    if (item) {
      item.status = status;
      if (error) item.error = error;
    }
  }

  /**
   * Retry item
   */
  retryItem(id: string): boolean {
    const item = this.queue.find(i => i.id === id);
    if (item && item.retries < item.maxRetries) {
      item.retries++;
      item.status = 'pending';
      item.error = undefined;
      return true;
    }
    return false;
  }

  /**
   * Remove item from queue
   */
  removeItem(id: string): void {
    this.queue = this.queue.filter(item => item.id !== id);
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Get queue size
   */
  getSize(): number {
    return this.queue.length;
  }

  /**
   * Is syncing
   */
  isSyncing(): boolean {
    return this.syncing;
  }

  /**
   * Set syncing status
   */
  setSyncing(syncing: boolean): void {
    this.syncing = syncing;
  }

  /**
   * Get all items
   */
  getAll(): SyncQueueItem[] {
    return this.queue;
  }
}

// ============================================================
// Local Storage Manager
// ============================================================

export class LocalStorageManager {
  private static readonly PREFIX = 'callisthenix_';

  /**
   * Save data to localStorage
   */
  static save(key: string, data: any): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`${this.PREFIX}${key}`, serialized);
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }

  /**
   * Load data from localStorage
   */
  static load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(`${this.PREFIX}${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Remove data from localStorage
   */
  static remove(key: string): void {
    localStorage.removeItem(`${this.PREFIX}${key}`);
  }

  /**
   * Clear all CallistheniX data
   */
  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Get all keys
   */
  static getKeys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.PREFIX))
      .map(key => key.replace(this.PREFIX, ''));
  }

  /**
   * Get storage size
   */
  static getSize(): number {
    let size = 0;
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        size += localStorage.getItem(key)?.length || 0;
      }
    });
    return size;
  }
}

// ============================================================
// IndexedDB Manager (for larger datasets)
// ============================================================

export class IndexedDBManager {
  private static readonly DB_NAME = 'CallistheniX';
  private static readonly VERSION = 1;
  private static db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB
   */
  static async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('workouts')) {
          db.createObjectStore('workouts', { keyPath: 'workoutId' });
        }
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'progressId' });
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Save data to IndexedDB
   */
  static async save(storeName: string, data: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Load data from IndexedDB
   */
  static async load<T>(storeName: string, key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  /**
   * Get all data from store
   */
  static async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Delete data from IndexedDB
   */
  static async delete(storeName: string, key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Clear store
   */
  static async clear(storeName: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// ============================================================
// Offline Manager (Unified)
// ============================================================

export interface OfflineState {
  isOnline: boolean;
  lastOnlineTime: Date;
  syncQueue: SyncQueue;
  cachedWorkouts: OfflineWorkout[];
  cachedProgress: OfflineProgress[];
  lastSyncTime: Date;
}

export class OfflineManager {
  private static state: OfflineState = {
    isOnline: navigator.onLine,
    lastOnlineTime: new Date(),
    syncQueue: new SyncQueue(),
    cachedWorkouts: [],
    cachedProgress: [],
    lastSyncTime: new Date(),
  };

  /**
   * Initialize offline manager
   */
  static async init(): Promise<void> {
    // Initialize IndexedDB
    try {
      await IndexedDBManager.init();
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }

    // Load cached data
    this.loadCachedData();

    // Setup online/offline listeners
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  /**
   * Handle going online
   */
  private static handleOnline(): void {
    this.state.isOnline = true;
    this.state.lastOnlineTime = new Date();
    console.log('✅ App is online');

    // Trigger sync
    this.syncPendingItems();
  }

  /**
   * Handle going offline
   */
  private static handleOffline(): void {
    this.state.isOnline = false;
    console.log('⚠️ App is offline');
  }

  /**
   * Save workout offline
   */
  static async saveWorkoutOffline(workout: OfflineWorkout): Promise<void> {
    workout.synced = false;
    workout.syncStatus = 'pending';

    // Save to cache
    this.state.cachedWorkouts.push(workout);
    LocalStorageManager.save('workouts', this.state.cachedWorkouts);

    // Add to sync queue
    this.state.syncQueue.addItem('workout', workout);

    // Try to sync if online
    if (this.state.isOnline) {
      await this.syncPendingItems();
    }
  }

  /**
   * Save progress offline
   */
  static async saveProgressOffline(progress: OfflineProgress): Promise<void> {
    progress.synced = false;
    progress.syncStatus = 'pending';

    // Save to cache
    this.state.cachedProgress.push(progress);
    LocalStorageManager.save('progress', this.state.cachedProgress);

    // Add to sync queue
    this.state.syncQueue.addItem('progress', progress);

    // Try to sync if online
    if (this.state.isOnline) {
      await this.syncPendingItems();
    }
  }

  /**
   * Sync pending items
   */
  static async syncPendingItems(): Promise<void> {
    if (this.state.syncQueue.isSyncing()) return;

    this.state.syncQueue.setSyncing(true);

    const pendingItems = this.state.syncQueue.getPendingItems();

    for (const item of pendingItems) {
      try {
        // Simulate sync (in real app, would call Firestore)
        await this.syncItem(item);
        this.state.syncQueue.updateItemStatus(item.id, 'synced');
      } catch (error) {
        console.error(`Failed to sync ${item.dataType}:`, error);
        if (!this.state.syncQueue.retryItem(item.id)) {
          this.state.syncQueue.updateItemStatus(item.id, 'failed', String(error));
        }
      }
    }

    this.state.syncQueue.setSyncing(false);
    this.state.lastSyncTime = new Date();
  }

  /**
   * Sync individual item (placeholder)
   */
  private static async syncItem(item: SyncQueueItem): Promise<void> {
    // In real implementation, would call Firestore
    return new Promise(resolve => {
      setTimeout(resolve, 100); // Simulate network delay
    });
  }

  /**
   * Load cached data
   */
  private static loadCachedData(): void {
    const cachedWorkouts = LocalStorageManager.load<OfflineWorkout[]>('workouts');
    const cachedProgress = LocalStorageManager.load<OfflineProgress[]>('progress');

    if (cachedWorkouts) this.state.cachedWorkouts = cachedWorkouts;
    if (cachedProgress) this.state.cachedProgress = cachedProgress;
  }

  /**
   * Get offline state
   */
  static getState(): OfflineState {
    return this.state;
  }

  /**
   * Is online
   */
  static isOnline(): boolean {
    return this.state.isOnline;
  }

  /**
   * Get sync queue
   */
  static getSyncQueue(): SyncQueue {
    return this.state.syncQueue;
  }

  /**
   * Get cached workouts
   */
  static getCachedWorkouts(): OfflineWorkout[] {
    return this.state.cachedWorkouts;
  }

  /**
   * Get cached progress
   */
  static getCachedProgress(): OfflineProgress[] {
    return this.state.cachedProgress;
  }

  /**
   * Clear offline cache
   */
  static clearCache(): void {
    this.state.cachedWorkouts = [];
    this.state.cachedProgress = [];
    this.state.syncQueue.clear();
    LocalStorageManager.clear();
  }

  /**
   * Get storage info
   */
  static getStorageInfo(): {
    localStorageSize: number;
    cachedWorkouts: number;
    cachedProgress: number;
    pendingSync: number;
  } {
    return {
      localStorageSize: LocalStorageManager.getSize(),
      cachedWorkouts: this.state.cachedWorkouts.length,
      cachedProgress: this.state.cachedProgress.length,
      pendingSync: this.state.syncQueue.getPendingItems().length,
    };
  }
}

// ============================================================
// Service Worker Registration
// ============================================================

export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// ============================================================
// Offline Utilities
// ============================================================

export function createOfflineWorkout(
  userId: string,
  exercises: OfflineWorkout['exercises'],
  totalDuration: number,
  notes?: string
): OfflineWorkout {
  return {
    workoutId: `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    timestamp: new Date(),
    exercises,
    totalDuration,
    notes,
    synced: false,
    syncStatus: 'pending',
  };
}

export function createOfflineProgress(
  userId: string,
  type: OfflineProgress['type'],
  targetId: string,
  progress: number
): OfflineProgress {
  return {
    progressId: `progress-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    targetId,
    progress,
    timestamp: new Date(),
    synced: false,
    syncStatus: 'pending',
  };
}
