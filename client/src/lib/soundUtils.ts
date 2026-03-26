// ============================================================
// CallistheniX – Sound Utilities
// Web Audio API for timer completion sound
// ============================================================

/**
 * Play a beep sound using Web Audio API
 * Creates a simple sine wave tone that plays for 200ms
 */
export function playBeepSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for the beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequency (higher pitch for alert)
    oscillator.frequency.value = 800; // Hz
    oscillator.type = 'sine';
    
    // Set volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    // Play the beep
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.log('Audio context not available:', error);
  }
}

/**
 * Play a double beep sound (more noticeable)
 */
export function playDoubleBeepSound(): void {
  playBeepSound();
  setTimeout(() => {
    playBeepSound();
  }, 250);
}

/**
 * Play a success sound (ascending tones)
 */
export function playSuccessSound(): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const notes = [
      { frequency: 523.25, duration: 0.1 }, // C5
      { frequency: 659.25, duration: 0.1 }, // E5
      { frequency: 783.99, duration: 0.2 }, // G5
    ];
    
    let currentTime = audioContext.currentTime;
    
    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);
      
      currentTime += note.duration;
    });
  } catch (error) {
    console.log('Audio context not available:', error);
  }
}
