import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { OfflineManager } from '@/lib/offlineSystem';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');
  const [pendingItems, setPendingItems] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      // Simulate sync
      setTimeout(() => setSyncStatus('synced'), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('idle');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending items
    const syncQueue = OfflineManager.getSyncQueue();
    setPendingItems(syncQueue.getPendingItems().length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && syncStatus === 'synced') {
    return null; // Don't show when online and synced
  }

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-all ${
        isOnline
          ? 'bg-green-100 text-green-800 border border-green-300'
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}
    >
      {isOnline ? (
        <>
          {syncStatus === 'syncing' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : syncStatus === 'synced' ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Synced</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4" />
              <span>Online</span>
            </>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>
            Offline
            {pendingItems > 0 && ` (${pendingItems} pending)`}
          </span>
        </>
      )}
    </div>
  );
}
