import { ShieldCheck, FileCheck, Lock } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Evidence-Based AI" },
  { icon: FileCheck, label: "Sources Verified" },
  { icon: Lock, label: "Data Protected" },
];

const TrustBadges = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 animate-fade-in-up-delay-3">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground"
        >
          <badge.icon className="w-4 h-4 text-accent" />
          {badge.label}
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
