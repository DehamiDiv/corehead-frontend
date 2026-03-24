import AdminNavbar from "@/components/admin/Navbar";
import DashboardHero from "@/components/admin/DashboardHero";
import FeatureCards from "@/components/admin/FeatureCards";
import TechStack from "@/components/admin/TechStack";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Blue Hero Container */}
      <div className="bg-gradient-to-b from-blue-200 to-blue-300/50 rounded-[3rem] pb-20 relative overflow-hidden">
        <AdminNavbar />
        <DashboardHero />
      </div>

      {/* Features & Tech Stack */}
      <div className="mt-8 relative z-10 space-y-20">
        <FeatureCards />
        <TechStack />
      </div>
    </div>
  );
}
