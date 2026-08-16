"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalAlert() {
  const [alertText, setAlertText] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.alert = (message: any) => {
        setAlertText(String(message));
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {alertText && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setAlertText(null)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100/50 flex flex-col items-center text-center"
          >
            <button
              onClick={() => setAlertText(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            
            <h4 className="text-base font-extrabold text-slate-900 mb-2 uppercase tracking-tight">
              Notification
            </h4>
            
            <p className="text-slate-500 text-sm font-semibold mb-6 max-h-40 overflow-y-auto px-1">
              {alertText}
            </p>
            
            <button
              onClick={() => setAlertText(null)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={14} />
              OK
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
