import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { voiceService } from "@/services/voiceService";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface VoiceCoachButtonProps {
  onResponse?: (text: string) => void;
}

export function VoiceCoachButton({ onResponse }: VoiceCoachButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<"el" | "en">("el");
  const [transcript, setTranscript] = useState("");
  const chatMutation = trpc.coach.chat.useMutation();

  useEffect(() => {
    // Update voice service config
    voiceService.updateConfig({
      onTranscript: (text) => {
        setTranscript(text);
        handleVoiceQuery(text);
      },
      onError: (error) => {
        toast.error(`Voice error: ${error}`);
        setIsListening(false);
      },
      onListening: (listening) => {
        setIsListening(listening);
      },
    });
  }, []);

  const handleVoiceQuery = async (query: string) => {
    if (!query.trim()) return;

    setIsListening(false);
    setIsSpeaking(true);

    try {
      // Detect language from the query
      const detectedLang = detectLanguage(query);
      setLanguage(detectedLang);

      // Send to coach
      const response = await chatMutation.mutateAsync({
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
      });

      if (response.success) {
        onResponse?.(response.message);
        // Speak the response in the detected language
        voiceService.speak(response.message, detectedLang);
        toast.success("Coach responded!");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Voice query error:", error);
      toast.error("Failed to process voice query");
    } finally {
      setIsSpeaking(false);
    }
  };

  const detectLanguage = (text: string): "el" | "en" => {
    // Greek characters: α-ω, Α-Ω
    const greekPattern = /[\u0370-\u03FF]/g;
    const greekCount = (text.match(greekPattern) || []).length;
    return greekCount > text.length * 0.3 ? "el" : "en";
  };

  const handleStartListening = () => {
    if (!voiceService.isRecognitionSupported()) {
      toast.error("Voice input not supported in your browser");
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setTranscript("");
      voiceService.startListening("el"); // Start with Greek, will auto-detect
      setIsListening(true);
    }
  };

  const handleStopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="fixed z-40 flex flex-col gap-3" style={{ right: "24px", bottom: "100px" }}>
      {/* Voice Input Button */}
      <Button
        onClick={handleStartListening}
        disabled={isSpeaking || chatMutation.isPending}
        className={`w-14 h-14 rounded-full p-0 flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
          isListening
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
        title={isListening ? "Stop listening" : "Ask CALIX with voice"}
      >
        {isListening ? (
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Voice Output Control */}
      {isSpeaking && (
        <Button
          onClick={handleStopSpeaking}
          className="w-14 h-14 rounded-full p-0 flex items-center justify-center shadow-lg bg-blue-600 hover:bg-blue-700 transition-all hover:scale-110"
          title="Stop speaking"
        >
          <Volume2 className="w-6 h-6 text-white animate-pulse" />
        </Button>
      )}

      {/* Language Indicator */}
      {isListening && (
        <div className="text-xs text-center text-slate-400 px-2 py-1 bg-slate-800 rounded">
          {language === "el" ? "🇬🇷 Ελληνικά" : "🇬🇧 English"}
        </div>
      )}

      {/* Transcript Preview */}
      {transcript && (
        <div className="text-xs text-center text-slate-300 px-2 py-1 bg-slate-800 rounded max-w-[100px] break-words">
          "{transcript.substring(0, 30)}..."
        </div>
      )}
    </div>
  );
}
