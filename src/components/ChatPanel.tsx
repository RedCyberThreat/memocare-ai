import { useState, useEffect } from "react";
import { Send, ShieldCheck, Bookmark, Volume2, Sparkles, Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  source?: string;
  confidence?: string;
}

const Waveform = () => (
  <div className="flex items-end gap-0.5 h-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="w-0.5 bg-primary/60 rounded-full animate-waveform"
        style={{ animationDelay: `${i * 0.15}s`, height: "4px" }}
      />
    ))}
  </div>
);

const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Calling your Supabase Edge Function directly
      const { data, error } = await supabase.functions.invoke('telegram-bot', {
        body: { 
          message: { text: input }, 
          isWebChat: true // We send a flag so the function knows it's not from Telegram
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: data.reply || "I'm processing that request.",
        source: data.source || "Care Knowledge Base",
        confidence: "High",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      toast({
        title: "Connection Error",
        description: "Could not reach the Care Companion. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="care-card glass-card flex flex-col h-[500px] animate-fade-in-up-delay-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Care Companion Chat</h2>
        <div className="flex items-center gap-2">
          <span className="care-badge bg-care-blue text-primary text-[10px]">
            <Search className="w-3 h-3" />
            RAG Enabled
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-10 text-sm italic">
            Ask a question about care protocols or patient history...
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all ${
                msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-care-blue text-foreground rounded-bl-sm"
              }`}>
              <p>{msg.text}</p>
              {msg.source && <p className="mt-2 text-[10px] opacity-70 italic">Source: {msg.source}</p>}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-care-blue p-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin opacity-50" />
              <span className="text-xs opacity-50">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-muted/50 rounded-2xl px-4 py-2 border border-border/30">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about care..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
        <button type="submit" disabled={isLoading} className="p-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
