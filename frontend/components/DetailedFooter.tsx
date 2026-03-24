import { Github, Twitter, Facebook, X } from "lucide-react";
import Link from "next/link";

export default function DetailedFooter() {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                C
              </div>
              <span className="text-lg font-bold text-slate-900">
                corehead.app
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              corehead.app. Secure and simple crypto trading. Trade responsibly.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="/features"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 underline decoration-slate-300"
                >
                  Guides
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Socials & Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-8 border-t border-slate-200">
          <div className="flex flex-col gap-1">
            <h5 className="font-bold text-slate-900 text-sm mb-2">
              Follow us on:
            </h5>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-blue-500 hover:text-blue-600 bg-white p-2 shadow-sm rounded border border-slate-200"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 bg-white p-2 shadow-sm rounded border border-slate-200"
              >
                <Facebook size={16} />
              </a>
              {/* Using X icon loosely if requested but image shows X text, will use generic */}
              <a
                href="#"
                className="text-slate-600 hover:text-slate-900 bg-white p-2 shadow-sm rounded border border-slate-200 font-bold text-xs h-[34px] w-[34px] flex items-center justify-center"
              >
                X
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-end text-xs text-slate-400">
            <div className="max-w-xs">
              <p>Copyright © 2025 SeekaHost Technologies Ltd.</p>
              <p>All Rights Reserved.</p>
              <p>Company Number: 16026964. VAT Number: 485829729.</p>
            </div>
            <div className="flex gap-4 underline">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Legal</Link>
              <Link href="#">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
