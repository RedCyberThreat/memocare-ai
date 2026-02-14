import { useState } from "react";
import { Heart, ChevronDown, ChevronUp, Music, Coffee, Users } from "lucide-react";

const memories = [
  {
    id: 1,
    icon: Music,
    category: "Favorites",
    title: "Loves classical piano music",
    detail: "Especially Chopin's nocturnes. Playing them in the evening helps Margaret relax.",
    color: "bg-care-lavender",
  },
  {
    id: 2,
    icon: Coffee,
    category: "Daily Routine",
    title: "Morning tea at 8:00 AM",
    detail: "Chamomile tea with one sugar. Prefers the blue mug with flowers.",
    color: "bg-care-warm",
  },
  {
    id: 3,
    icon: Users,
    category: "Family",
    title: "Granddaughter Emma visits Sundays",
    detail: "Margaret lights up when Emma visits. They enjoy looking at the garden together.",
    color: "bg-care-green-light",
  },
];

const MemoryVault = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="care-card animate-fade-in-up-delay-3">
      <div className="flex items-center gap-2 mb-5">
        <Heart className="w-5 h-5 text-destructive" />
        <h2 className="text-lg font-bold text-foreground">Memory Vault</h2>
      </div>

      <div className="space-y-3">
        {memories.map((memory) => (
          <button
            key={memory.id}
            onClick={() => setExpanded(expanded === memory.id ? null : memory.id)}
            className={`w-full text-left ${memory.color} rounded-2xl p-4 transition-all hover:shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <memory.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{memory.category}</p>
                  <p className="text-sm font-semibold text-foreground">{memory.title}</p>
                </div>
              </div>
              {expanded === memory.id ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            {expanded === memory.id && (
              <p className="text-sm text-muted-foreground mt-3 pl-8 leading-relaxed">
                {memory.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryVault;
