import { useEffect, useRef } from "react";
import { Brain } from "lucide-react";

interface MetricProps {
  label: string;
  value: number;
  color: string;
  delay: number;
}

const RadialProgress = ({ label, value, color, delay }: MetricProps) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (value / 100) * circumference;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
    const timeout = setTimeout(() => {
      circle.style.transition = "stroke-dashoffset 1.5s ease-out";
      circle.style.strokeDashoffset = `${targetOffset}`;
    }, delay);
    return () => clearTimeout(timeout);
  }, [circumference, targetOffset, delay]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
          {value}%
        </span>
      </div>
      <span className="text-xs font-semibold text-muted-foreground text-center">{label}</span>
    </div>
  );
};

const CareIntelligence = () => {
  const metrics = [
    { label: "Understanding", value: 92, color: "hsl(var(--primary))", delay: 200 },
    { label: "Personalization", value: 87, color: "hsl(var(--care-green))", delay: 400 },
    { label: "Responsiveness", value: 95, color: "hsl(210 60% 55%)", delay: 600 },
  ];

  return (
    <div className="care-card glass-card glow-border-active animate-fade-in-up-delay-3">
      <div className="flex items-center gap-2 mb-5">
        <Brain className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Care Intelligence</h2>
        <span className="care-badge bg-care-lavender text-primary text-[10px] ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-care-green inline-block animate-pulse" />
          Continuously Learning
        </span>
      </div>

      <div className="flex items-center justify-around">
        {metrics.map((metric) => (
          <RadialProgress key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-care-green inline-block" />
        Model updated 2 hours ago
      </div>
    </div>
  );
};

export default CareIntelligence;
