import { MessageCircle, BookOpen, Lightbulb, Settings, Globe, User, Sparkles } from "lucide-react";

const quickActions = [
  { label: "Ask a Question", icon: MessageCircle, bg: "bg-care-blue" },
  { label: "Log Memory", icon: BookOpen, bg: "bg-care-green-light" },
  { label: "Today's Tip", icon: Lightbulb, bg: "bg-care-warm" },
];

const DashboardHeader = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide uppercase">MemoCare AI</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {greeting}, Sarah 💛
        </h1>
        <p className="text-muted-foreground mt-1 text-base">
          How is Margaret doing today?
        </p>
      </div>

      <div className="flex items-center gap-3 animate-fade-in-up-delay-1">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className={`${action.bg} flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-foreground transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95`}
          >
            <action.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 animate-fade-in-up-delay-2">
        <button className="p-2 rounded-xl hover:bg-muted transition-colors" aria-label="Language">
          <Globe className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-xl hover:bg-muted transition-colors" aria-label="Settings">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
