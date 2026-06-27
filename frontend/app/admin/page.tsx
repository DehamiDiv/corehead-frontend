import AdminNavbar from "@/components/admin/Navbar";
import DashboardHero from "@/components/admin/DashboardHero";
import DashboardStats from "@/components/admin/DashboardStats";
import FeatureCards from "@/components/admin/FeatureCards";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Blue Hero Container */}
      <div className="bg-gradient-to-b from-blue-200 to-blue-300/50 rounded-[3rem] pb-12 relative overflow-hidden">
        <AdminNavbar />
        <DashboardHero />
        <DashboardStats />
      </div>

      {/* Features & Content */}
      <div className="mt-8 relative z-10 space-y-12">
        <FeatureCards />
      </div>
    </div>
  );
}
