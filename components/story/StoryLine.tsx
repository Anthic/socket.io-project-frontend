"use client";
import { motion } from "framer-motion";
import { Sparkles, Edit2, Trash2 } from "lucide-react";
import { StoryLine as StoryLineType } from "../../store/roomStore";

type Props = {
  line: StoryLineType;
  index: number;
  onUpdate?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
};

export default function StoryLine({ line, index, onUpdate, onDelete }: Props) {
  const isAI = line.isAIGenerated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`group relative flex gap-6 px-6 py-5 rounded-2xl transition-all duration-300 ${
        isAI
          ? "border border-purple-500/30 bg-purple-950/10 backdrop-blur-sm"
          : "hover:bg-white/[0.04] border border-transparent hover:border-white/5"
      }`}
      style={
        isAI
          ? {
              boxShadow:
                "inset 0 0 30px rgba(139,92,246,0.05), 0 5px 15px rgba(0,0,0,0.2)",
            }
          : {}
      }
    >
      {/* Dynamic left border for AI */}
      {isAI && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-gradient-to-b from-purple-500/50 to-transparent rounded-r-full" />
      )}

      {/* Line Number / Avatar Placeholder */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        {!isAI && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-xs font-bold border border-[var(--accent-gold)]/30"
            style={{
              background: "rgba(201,168,76,0.1)",
              color: "var(--accent-gold)",
            }}
          >
            {line.author?.firstName?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
        {isAI && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center border border-purple-500/30"
            style={{ background: "rgba(167, 139, 250, 0.1)", color: "#a78bfa" }}
          >
            <Sparkles size={14} />
          </div>
        )}
        <span
          className="text-[10px] font-mono opacity-50"
          style={{ color: "var(--text-muted)" }}
        >
          {String(line.lineNumber).padStart(3, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        {isAI && (
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-cinzel font-bold tracking-widest uppercase"
              style={{
                color: "#a78bfa",
                textShadow: "0 0 10px rgba(167,139,250,0.5)",
              }}
            >
              The Archives Speak
            </span>
          </div>
        )}

        <p
          className="font-lora leading-loose text-lg italic tracking-wide"
          style={{
            color: isAI ? "#c4b5fd" : "var(--text-primary)",
            textShadow: isAI ? "0 0 15px rgba(167,139,250,0.2)" : "none",
          }}
        >
          &quot;{line.content}&quot;
        </p>

        {/* Author Footer */}
        <div className="mt-3 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          <div
            className="flex items-center gap-2 text-xs font-lora italic"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="w-4 h-[1px] bg-current"></span>
            <span>
              {isAI
                ? "Penned by Destiny"
                : `Penned by ${line.author?.firstName || "Unknown Scribe"}`}
            </span>
          </div>

          {/* Actions (Mock for now to fill space elegantly, could connect to props later) */}
          {!isAI && (onUpdate || onDelete) && (
            <div className="flex gap-2">
              {onUpdate && (
                <button className="p-1 hover:text-[var(--accent-gold)] transition-colors">
                  <Edit2 size={12} />
                </button>
              )}
              {onDelete && (
                <button className="p-1 hover:text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
