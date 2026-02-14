import { useState } from "react";
import { Monitor } from "lucide-react";

const DemoModeToggle = () => {
  const [demoMode, setDemoMode] = useState(true);

  return (
    <button
      onClick={() => setDemoMode(!demoMode)}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-lg backdrop-blur-md ${
        demoMode
          ? "bg-primary/90 text-primary-foreground glow-border"
          : "bg-card/80 text-muted-foreground border border-border"
      }`}
    >
      <Monitor className="w-3.5 h-3.5" />
      <span>Demo Mode {demoMode ? "ON" : "OFF"}</span>
      <span className={`w-2 h-2 rounded-full ${demoMode ? "bg-care-green animate-pulse" : "bg-muted"}`} />
    </button>
  );
};

export default DemoModeToggle;
