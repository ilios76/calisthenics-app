import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { Loader2, Send, X, Volume2, VolumeX } from "lucide-react";
import { Streamdown } from "streamdown";
import { ttsService } from "@/services/ttsService";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CoachChatBotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  embedded?: boolean; // when true, renders inline (no Dialog wrapper)
}

export function CoachChatBot({ open, onOpenChange, embedded = false }: CoachChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! 💪 I'm your CallistheniX Coach. Ask me anything about calisthenics, training, nutrition, form, or recovery. What's on your mind?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.coach.chat.useMutation();

  const handleSpeak = async (messageIndex: number, text: string) => {
    try {
      if (speakingIndex === messageIndex) {
        ttsService.stop();
        setSpeakingIndex(null);
      } else {
        ttsService.stop();
        setSpeakingIndex(messageIndex);
        await ttsService.speak(text, { rate: 1, pitch: 1, volume: 1 });
        setSpeakingIndex(null);
      }
    } catch (error) {
      console.error("TTS error:", error);
      setSpeakingIndex(null);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Shared inner content (used in both embedded and dialog modes)
  const chatContent = (
    <>

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
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      {message.role === "assistant" ? (
                        <Streamdown className="text-sm">{message.content}</Streamdown>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                    {message.role === "assistant" && ttsService.isAvailable() && (
                      <button
                        onClick={() => handleSpeak(index, message.content)}
                        className="flex-shrink-0 p-1 hover:bg-slate-700 rounded transition-colors"
                        title="Read aloud"
                      >
                        {speakingIndex === index ? (
                          <VolumeX className="w-4 h-4 text-green-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-slate-400 hover:text-green-400" />
                        )}
                      </button>
                    )}
                  </div>
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
        </div>
    </>
  );

  if (embedded) {
    return (
      <div className="flex flex-col h-full" style={{ minHeight: '400px' }}>
        {chatContent}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md h-[600px] flex flex-col p-0 gap-0 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700">
        {chatContent}
      </DialogContent>
    </Dialog>
  );
}
