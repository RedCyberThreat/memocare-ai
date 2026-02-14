import { useState } from "react";
import { Send, ShieldCheck, Bookmark, Volume2 } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  source?: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "user",
    text: "Margaret keeps asking the same question over and over. How should I respond?",
  },
  {
    id: 2,
    role: "ai",
    text: "Repetitive questioning is very common in Alzheimer's. Try to answer calmly each time as if it's the first time. You can also gently redirect attention to a comforting activity like looking at a photo album together.",
    source: "Alzheimer's Association Clinical Guide, 2024",
  },
];

const ChatPanel = () => {
  const [messages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  return (
    <div className="care-card flex flex-col h-[420px] animate-fade-in-up-delay-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Care Companion Chat</h2>
        <span className="care-badge bg-care-lavender text-primary">
          <ShieldCheck className="w-3.5 h-3.5" />
          Evidence-Based AI
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-care-blue text-foreground rounded-bl-md"
              }`}
            >
              <p>{msg.text}</p>
              {msg.source && (
                <p className="mt-2 text-xs opacity-70 italic">
                  Based on: {msg.source}
                </p>
              )}
              {msg.role === "ai" && (
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/30">
                  <button className="text-xs flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                    <Volume2 className="w-3 h-3" /> Listen
                  </button>
                  <button className="text-xs flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                    <Bookmark className="w-3 h-3" /> Save
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-muted rounded-2xl px-4 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about Margaret's care..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        <button className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
