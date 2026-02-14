import { Brain, Lightbulb, TrendingUp, Volume2 } from "lucide-react";
import heroCare from "@/assets/hero-care.jpg";

const DailyCareCard = () => {
  return (
    <div className="care-card relative overflow-hidden animate-fade-in-up-delay-1">
      {/* Soft background image overlay */}
      <div className="absolute inset-0 opacity-10 rounded-2xl overflow-hidden">
        <img src={heroCare} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">Daily Care Insight</h2>
          <span className="care-badge bg-care-green-light text-secondary-foreground">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            Updated today
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-care-blue rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-muted-foreground">Today's Focus</span>
            </div>
            <p className="text-foreground font-semibold">Routine Consistency</p>
            <p className="text-sm text-muted-foreground mt-1">
              Keeping daily routines predictable helps reduce confusion and anxiety.
            </p>
          </div>

          <div className="bg-care-green-light rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-muted-foreground">Suggested Strategy</span>
            </div>
            <p className="text-foreground font-semibold">Visual Schedule Board</p>
            <p className="text-sm text-muted-foreground mt-1">
              Use a whiteboard with pictures for meal times, walks, and rest periods.
            </p>
          </div>

          <div className="bg-care-warm rounded-2xl p-5">
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

        <button className="mt-4 flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
          <Volume2 className="w-4 h-4" />
          Listen to today's insight
        </button>
      </div>
    </div>
  );
};

export default DailyCareCard;
