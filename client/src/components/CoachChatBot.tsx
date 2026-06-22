import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { Loader2, Send, X, Mic, MicOff, MessageSquare } from "lucide-react";
import { Streamdown } from "streamdown";
import { voiceService } from "@/services/voiceService";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CoachChatBotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoachChatBot({ open, onOpenChange }: CoachChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! 💪 I'm your CallistheniX Coach. Ask me anything about calisthenics, training, nutrition, form, or recovery. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useVoice, setUseVoice] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.coach.chat.useMutation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const startVoiceInput = () => {
    if (!voiceService.isRecognitionSupported()) {
      toast.error("Voice input not supported in your browser");
      setUseVoice(false);
      return;
    }

    setIsListening(true);
    setTranscript("");
    voiceService.updateConfig({
      onTranscript: (text) => {
        setTranscript(text);
      },
      onError: (error) => {
        toast.error(`Voice error: ${error}`);
        setIsListening(false);
      },
      onListening: (listening) => {
        setIsListening(listening);
      },
    });
    voiceService.startListening("el");
  };

  const stopVoiceInput = () => {
    voiceService.stopListening();
    setIsListening(false);
    if (transcript.trim()) {
      setInput(transcript);
      setTranscript("");
    }
  };

  const handleSendMessage = async () => {
    let messageText = input;
    if (isListening && transcript.trim()) {
      messageText = transcript;
      stopVoiceInput();
    }
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the coach chat API
      const response = await chatMutation.mutateAsync({
        messages: [...messages, userMessage],
      });

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            content: response.message,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            content: response.message,
          },
        ]);
      }
    } catch (error) {
      if (isListening) stopVoiceInput();
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceMode = () => {
    if (isListening) stopVoiceInput();
    setUseVoice(!useVoice);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md h-[600px] flex flex-col p-0 gap-0 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700">
        <DialogHeader className="border-b border-slate-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                💪
              </div>
              <DialogTitle className="text-white">CallistheniX Coach</DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Streamdown className="text-sm">{message.content}</Streamdown>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-slate-700 p-4 bg-slate-900">
          <div className="flex flex-col gap-3">
            {/* Voice/Text Toggle */}
            <div className="flex gap-2">
              <Button
                onClick={toggleVoiceMode}
                variant="outline"
                size="sm"
                className={`flex-1 ${
                  useVoice
                    ? "bg-green-600 border-green-500 text-white hover:bg-green-700"
                    : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {useVoice ? (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Voice
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text
                  </>
                )}
              </Button>
            </div>

            {/* Voice Input */}
            {useVoice ? (
              <div className="flex gap-2">
                <Button
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  disabled={isLoading}
                  className={`flex-1 ${
                    isListening
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Speak
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!input.trim() && !transcript.trim())}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              /* Text Input */
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500 focus:ring-green-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Transcript Display */}
            {isListening && transcript && (
              <div className="text-xs text-slate-400 px-3 py-2 bg-slate-800 rounded border border-slate-700">
                <span className="text-green-400 font-semibold">Hearing:</span> {transcript}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
