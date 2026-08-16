import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import ToastProvider from "@/components/ui/ToastProvider";
import GlobalAlert from "@/components/GlobalAlert";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "CoreHead | Intelligent Blog Builder",
  description: "Create, customize, and publish dynamic blogs instantly using our AI-powered visual builder.",
  referrer: 'no-referrer-when-downgrade' as const,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;600;700&family=Poppins:wght@300;400;600;700&family=Outfit:wght@300;400;600;700&family=Nunito:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&family=Merriweather:wght@300;400;700&family=Lora:wght@400;600;700&family=EB+Garamond:wght@400;600&family=JetBrains+Mono:wght@400;500&family=Fira+Code:wght@400;500&family=Space+Mono:wght@400;700&family=Bebas+Neue&family=Pacifico&family=Righteous&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        <ToastProvider />
        <GlobalAlert />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
