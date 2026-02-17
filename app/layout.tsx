import type { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
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
          <div className="mx-auto flex max-w-7xl">
            <Sidebar />

            <div className="flex w-full flex-col">
              <Topbar />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

