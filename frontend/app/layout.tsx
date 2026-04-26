import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "CoreHead | Intelligent Blog Builder",
  description: "Create, customize, and publish dynamic blogs instantly using our AI-powered visual builder.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
