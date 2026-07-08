// ============================================================
// CallistheniX – Text-to-Speech Service
// Converts text to speech using browser Web Speech API
// ============================================================

export interface TTSOptions {
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  lang?: string; // language code
}

export class TTSService {
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean;

  constructor() {
    this.synth = window.speechSynthesis;
    this.isSupported = !!this.synth;
  }

  /**
   * Check if TTS is supported in the browser
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Speak text with optional configuration
   */
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error("Text-to-Speech not supported in this browser"));
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      utterance.lang = options.lang || "en-US";

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech error: ${event.error}`));
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  /**
   * Set voice by name
   */
  setVoice(voiceName: string): void {
    const voices = this.getVoices();
    const voice = voices.find((v) => v.name === voiceName);
    if (voice && this.currentUtterance) {
      this.currentUtterance.voice = voice;
    }
  }
}

// Export singleton instance
export const ttsService = new TTSService();
