import { Brain, Lightbulb, TrendingUp, Volume2, Sparkles } from "lucide-react";
import heroCare from "@/assets/hero-care.jpg";

const DailyCareCard = () => {
  return (
    <div className="care-card relative overflow-hidden animate-fade-in-up-delay-1 glow-border-active">
      {/* Soft background image overlay */}
      <div className="absolute inset-0 opacity-10 rounded-2xl overflow-hidden">
        <img src={heroCare} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-care-blue/40 via-transparent to-care-lavender/30" />

      {/* Floating light orbs */}
      <div className="absolute top-8 right-12 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float-light" />
      <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-care-green/15 blur-2xl animate-float-light" style={{ animationDelay: "3s" }} />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <h2 className="text-xl font-bold text-foreground">Daily Care Insight</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="care-badge bg-care-lavender text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block pulse-gentle" />
              AI-Generated
            </span>
            <span className="care-badge bg-care-green-light text-secondary-foreground">
              <span className="w-2 h-2 rounded-full bg-accent inline-block font-semibold text-green-700" />
              Updated today
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-care-blue/80 backdrop-blur-sm rounded-2xl p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-muted-foreground">Today's Focus</span>
            </div>
            <p className="text-foreground font-semibold">Routine Consistency</p>
            <p className="text-sm text-muted-foreground mt-1">
              Keeping daily routines predictable helps reduce confusion and anxiety.
            </p>
          </div>

          <div className="bg-care-green-light/80 backdrop-blur-sm rounded-2xl p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-accent-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">Suggested Strategy</span>
            </div>
            <p className="text-foreground font-semibold">Visual Schedule Board</p>
            <p className="text-sm text-muted-foreground mt-1">
              Use a whiteboard with pictures for meal times, walks, and rest periods.
            </p>
          </div>

          <div className="bg-care-warm/80 backdrop-blur-sm rounded-2xl p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-destructive" />
              <span className="text-sm font-semibold text-muted-foreground">You're Doing Great</span>
            </div>
            <p className="text-foreground font-semibold">Keep Going, Sarah 💙</p>
            <p className="text-sm text-muted-foreground mt-1">
              Consistency is the strongest gift you give Margaret every day.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
            <Volume2 className="w-4 h-4" />
            Listen to today's insight
          </button>
          <span className="text-[10px] text-muted-foreground italic">
            Sources Validated · Confidence: High
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyCareCard;
