import DashboardHeader from "@/components/DashboardHeader";
import DailyCareCard from "@/components/DailyCareCard";
import ChatPanel from "@/components/ChatPanel";
import CareTimeline from "@/components/CareTimeline";
import MemoryVault from "@/components/MemoryVault";
import InsightsCard from "@/components/InsightsCard";
import TrustBadges from "@/components/TrustBadges";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <DashboardHeader />

        <main className="mt-8 space-y-6">
          {/* Hero: Daily Care Insight */}
          <DailyCareCard />

          {/* Two-column: Chat + Timeline */}
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <ChatPanel />
            </div>
            <div className="lg:col-span-2">
              <CareTimeline />
            </div>
          </div>

          {/* Two-column: Memory Vault + Insights */}
          <div className="grid gap-6 md:grid-cols-2">
            <MemoryVault />
            <InsightsCard />
          </div>

          {/* Trust indicators */}
          <TrustBadges />
        </main>
      </div>
    </div>
  );
};

export default Index;
