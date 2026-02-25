

"use client";
import { motion } from "framer-motion";

import { Sparkles } from "lucide-react";
import { StoryLine as StoryLineType } from "../../store/roomStore";

type Props = {
  line: StoryLineType;
  index: number;
};

export default function StoryLine({ line, index }: Props) {
  const isAI = line.isAIGenerated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className={`group relative flex gap-4 px-4 py-3 rounded-lg transition-all ${
        isAI
          ? "border border-purple-500/30 bg-purple-950/20"
          : "hover:bg-white/[0.02]"
      }`}
      style={isAI ? { boxShadow: "0 0 20px rgba(139,92,246,0.15)" } : {}}>

      {/* Line Number */}
      <span className="text-xs mt-1 w-8 shrink-0 text-right font-mono"
        style={{ color: "var(--text-muted)" }}>
        {line.lineNumber}.
      </span>

      {/* Content */}
      <div className="flex-1">
        {isAI && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={12} style={{ color: "#a78bfa" }} />
            <span className="text-xs font-medium" style={{ color: "#a78bfa" }}>
              Mysterious Twist
            </span>
          </div>
        )}
        <p className="font-lora leading-relaxed text-base italic"
          style={{ color: isAI ? "#c4b5fd" : "var(--text-primary)" }}>
          "{line.content}"
        </p>

        {/* Author (show on hover) */}
        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            — {isAI ? "The Dark Library" : `${line.author.firstName}`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}