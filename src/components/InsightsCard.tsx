import { BarChart3, MessageCircle, HelpCircle, Sparkles } from "lucide-react";

const InsightsCard = () => {
  return (
    <div className="care-card animate-fade-in-up-delay-3">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Weekly Insights</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-care-blue flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">12 questions asked</p>
              <p className="text-xs text-muted-foreground">This week</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-accent">+3 vs last week</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-care-peach flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Top concern</p>
              <p className="text-xs text-muted-foreground">Repetitive questioning</p>
            </div>
          </div>
        </div>

        <div className="bg-care-green-light rounded-2xl p-4 mt-2">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-foreground">Encouragement</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You've been incredibly consistent this week. Your dedication to Margaret's care makes a real difference. Keep trusting yourself. 💚
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsCard;
