import DashboardHero from "@/components/admin/DashboardHero";
import FeatureCards from "@/components/admin/FeatureCards";
import TechStack from "@/components/admin/TechStack";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardHero />
      <FeatureCards />
      <div className="pb-20">
        <TechStack />
      </div>
    </div>
  );
}
