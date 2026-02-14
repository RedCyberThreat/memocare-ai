import { ShieldCheck, FileCheck, Lock, Globe, Database } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Evidence-Based RAG System" },
  { icon: FileCheck, label: "Sources Verified" },
  { icon: Lock, label: "Privacy Protected" },
  { icon: Globe, label: "Multilingual AI" },
  { icon: Database, label: "HIPAA-Aware Design" },
];

const TrustBadges = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-6 animate-fade-in-up-delay-3">
      {badges.map((badge, i) => (
        <div
          key={badge.label}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-muted-foreground transition-all duration-300 hover:scale-105 hover:glow-border"
          style={{ animationDelay: `${0.3 + i * 0.05}s` }}
        >
          <badge.icon className="w-4 h-4 text-primary" />
          {badge.label}
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
