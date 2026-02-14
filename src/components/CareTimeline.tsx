import { Clock, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

const events = [
  {
    id: 1,
    type: "incident",
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-care-peach",
    title: "Mild confusion during lunch",
    time: "Today, 12:30 PM",
  },
  {
    id: 2,
    type: "strategy",
    icon: CheckCircle,
    color: "text-accent",
    bg: "bg-care-green-light",
    title: "Visual schedule board introduced",
    time: "Yesterday, 9:00 AM",
  },
  {
    id: 3,
    type: "pattern",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-care-blue",
    title: "Evenings calmer with music routine",
    time: "This week",
  },
];

const CareTimeline = () => {
  return (
    <div className="care-card animate-fade-in-up-delay-3">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Care Timeline</h2>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full ${event.bg} flex items-center justify-center`}>
                <event.icon className={`w-4 h-4 ${event.color}`} />
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 flex-1 bg-border mt-1" />
              )}
            </div>
            <div className="pb-4">
              <p className="text-sm font-semibold text-foreground">{event.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="text-sm text-primary font-semibold hover:underline mt-2">
        View full timeline →
      </button>
    </div>
  );
};

export default CareTimeline;
