import { Github, Twitter, Facebook, X } from "lucide-react";
import Link from "next/link";

export default function DetailedFooter() {
  return (
    <footer className="bg-white pt-32 pb-20 px-6 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#2563eb] flex items-center justify-center text-white font-bold text-sm shadow-md">
                C
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                corehead.app
              </span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
              The ultimate headless CMS for modern web development. Build, manage, and scale your content with ease.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-lg">Product</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Demo</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6 text-lg">Support</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">FAQs</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-100">
          <div className="text-slate-400 text-sm font-medium">
            © 2025 CoreHead CMS. All rights reserved.
          </div>
          
          <div className="flex gap-8 text-sm font-medium text-slate-400">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
