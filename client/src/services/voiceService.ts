/*
 * Voice Input/Output Service for CallistheniX Coach
 * Handles speech-to-text and text-to-speech with Greek and English support
 */

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export interface VoiceServiceConfig {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  onListening?: (isListening: boolean) => void;
}

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesisUtterance | null = null;
  private isListening = false;
  private config: VoiceServiceConfig = {};

  constructor(config?: VoiceServiceConfig) {
    this.config = config || {};
    this.initializeRecognition();
  }

  private initializeRecognition() {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      
      if (this.recognition) {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = "el-GR"; // Default to Greek
        this.recognition.onstart = () => {
          this.isListening = true;
          this.config.onListening?.(true);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.config.onListening?.(false);
        };

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          this.config.onTranscript?.(transcript);
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          this.config.onError?.(event.error);
        };
      }
    }
  }

  /**
   * Start listening for voice input
   * @param language - 'el' for Greek, 'en' for English
   */
  public startListening(language: "el" | "en" = "el") {
    if (!this.recognition) {
      this.config.onError?.("Speech Recognition not supported");
      return;
    }

    this.recognition.lang = language === "el" ? "el-GR" : "en-US";
    this.recognition.start();
  }

  /**
   * Stop listening
   */
  public stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Abort listening
   */
  public abort() {
    if (this.recognition) {
      this.recognition.abort();
    }
  }

  /**
   * Check if currently listening
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Speak text using text-to-speech
   * @param text - Text to speak
   * @param language - 'el' for Greek, 'en' for English
   */
  public speak(text: string, language: "el" | "en" = "el") {
    if (!("speechSynthesis" in window)) {
      this.config.onError?.("Speech Synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "el" ? "el-GR" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop speaking
   */
  public stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// Export singleton instance
export const voiceService = new VoiceService();
