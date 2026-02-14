import { Activity, Zap, Shield, Brain } from "lucide-react";

const activities = [
  {
    icon: Brain,
    text: "Identified recurring confusion pattern at mealtimes",
    time: "2 days ago",
  },
  {
    icon: Zap,
    text: "Suggested 3 calming strategies based on Margaret's profile",
    time: "3 days ago",
  },
  {
    icon: Shield,
    text: "Helped reduce repeated question stress by 40%",
    time: "This week",
  },
];

const AIActivityPanel = () => {
  return (
    <div className="care-card glass-card animate-fade-in-up-delay-3">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">AI Activity</h2>
        <span className="care-badge bg-care-blue text-primary text-[10px] ml-auto">
          This Week
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-4 italic">
        This week MemoCare has:
      </p>

      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/50 transition-all duration-300 hover:bg-care-blue/50"
            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
          >
            <div className="w-7 h-7 rounded-full bg-care-lavender flex items-center justify-center flex-shrink-0 mt-0.5">
              <activity.icon className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground font-medium leading-snug">{activity.text}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIActivityPanel;
