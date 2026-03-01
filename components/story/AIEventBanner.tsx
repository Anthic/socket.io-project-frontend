// 💡 AI plot twist এলে এই banner দেখায়
// Purple glow + animation
// 6 সেকেন্ড পরে automatically disappear

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

type Props = { event: string | null };

export default function AIEventBanner({ event }: Props) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="mx-auto max-w-3xl my-6 rounded-2xl p-5 border relative overflow-hidden backdrop-blur-md z-50"
          style={{
            background: "rgba(30,10,60,0.8)",
            borderColor: "rgba(167,139,250,0.4)",
            boxShadow:
              "0 10px 30px rgba(109,49,255,0.2), inset 0 0 20px rgba(139,92,246,0.1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10 animate-pulse pointer-events-none"></div>

          <div className="flex items-start gap-4 relative z-10">
            {/* Icon */}
            <div
              className="p-3 rounded-xl shrink-0 border shadow-[0_0_15px_rgba(167,139,250,0.3)]"
              style={{
                background: "rgba(139,92,246,0.15)",
                borderColor: "rgba(167,139,250,0.3)",
              }}
            >
              <Sparkles
                size={20}
                className="animate-spin-slow"
                style={{ color: "#a78bfa" }}
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap size={14} className="text-purple-400 animate-pulse" />
                <span
                  className="text-[10px] font-bold tracking-widest font-cinzel uppercase"
                  style={{
                    color: "#c4b5fd",
                    textShadow: "0 0 10px rgba(167,139,250,0.5)",
                  }}
                >
                  Divine Intervention
                </span>
              </div>
              <p
                className="font-lora italic text-base leading-relaxed"
                style={{ color: "#ddd6fe" }}
              >
                &quot;{event}&quot;
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
