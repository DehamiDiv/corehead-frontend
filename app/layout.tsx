import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Corehead",
  description: "Corehead Frontend",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50">
          {children}
        </div>
      </body>
    </html>
  );
}

