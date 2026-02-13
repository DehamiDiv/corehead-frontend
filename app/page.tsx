import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
