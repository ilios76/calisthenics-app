/**
 * Voice Input/Output Service for CALIX Coach
 * Handles speech-to-text and text-to-speech with Greek and English support
 */

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
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
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
   * Stop listening for voice input
   */
  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
    }
  }

  /**
   * Detect language of text (simple heuristic)
   */
  private detectLanguage(text: string): "el" | "en" {
    // Greek characters: α-ω, Α-Ω
    const greekPattern = /[\u0370-\u03FF]/g;
    const greekCount = (text.match(greekPattern) || []).length;
    return greekCount > text.length * 0.3 ? "el" : "en";
  }

  /**
   * Clean text for natural speech (remove markdown, symbols, etc.)
   */
  private cleanTextForSpeech(text: string): string {
    return text
      .replace(/\*/g, "") // Remove asterisks (*)
      .replace(/\*\*/g, "") // Remove bold markers
      .replace(/_/g, "") // Remove underscores
      .replace(/`/g, "") // Remove backticks
      .replace(/\[([^\]]+)\]/g, "$1") // Replace [text] with text
      .replace(/\(([^)]+)\)/g, "$1") // Replace (text) with text
      .replace(/#+\s/g, "") // Remove markdown headers
      .replace(/[-•]\s/g, "") // Remove bullet points
      .replace(/\n+/g, " ") // Replace newlines with space
      .trim();
  }

  /**
   * Speak text using text-to-speech
   * @param text - Text to speak
   * @param language - Optional language override
   */
  public speak(text: string, language?: "el" | "en") {
    if (!("speechSynthesis" in window)) {
      this.config.onError?.("Text-to-Speech not supported");
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const lang = language || this.detectLanguage(text);
    const cleanText = this.cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = lang === "el" ? "el-GR" : "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 0.8; // Lower pitch for male voice
    utterance.volume = 1;

    // Use a male voice that matches the language
    const voices = window.speechSynthesis.getVoices();
    const langCode = lang === "el" ? "el" : "en";
    
    // Try to find a male voice
    const maleVoice = voices.find(
      (voice) => voice.lang.startsWith(langCode) && 
      (voice.name.toLowerCase().includes("male") || 
       voice.name.toLowerCase().includes("man") ||
       voice.name.toLowerCase().includes("guy"))
    );
    
    // Fallback to any voice matching the language
    const fallbackVoice = voices.find((voice) => voice.lang.startsWith(langCode));
    
    if (maleVoice) {
      utterance.voice = maleVoice;
    } else if (fallbackVoice) {
      utterance.voice = fallbackVoice;
    }

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

  /**
   * Check if browser supports speech recognition
   */
  public isRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  /**
   * Check if browser supports speech synthesis
   */
  public isSynthesisSupported(): boolean {
    return "speechSynthesis" in window;
  }

  /**
   * Get current listening state
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Update config
   */
  public updateConfig(config: Partial<VoiceServiceConfig>) {
    this.config = { ...this.config, ...config };
  }
}

// Export singleton instance
export const voiceService = new VoiceService();
