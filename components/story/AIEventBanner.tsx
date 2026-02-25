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
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="mx-4 my-3 rounded-xl p-4 border"
          style={{
            background: "rgba(109,49,255,0.15)",
            borderColor: "rgba(139,92,246,0.4)",
            animation: "aiPulse 2s ease-in-out infinite",
          }}>

          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="p-2 rounded-lg shrink-0"
              style={{ background: "rgba(139,92,246,0.2)" }}>
              <Sparkles size={16} style={{ color: "#a78bfa" }} />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={12} style={{ color: "#a78bfa" }} />
                <span className="text-xs font-semibold tracking-wider font-cinzel"
                  style={{ color: "#c4b5fd" }}>
                  THE STORY TAKES A TURN
                </span>
              </div>
              <p className="font-lora italic text-sm leading-relaxed"
                style={{ color: "#ddd6fe" }}>
                "{event}"
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}