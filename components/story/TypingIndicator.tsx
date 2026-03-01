// 💡 "Sarah is typing..." indicator
// Animated dots দিয়ে

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TypingUser } from "../../store/roomStore";
import { Feather } from "lucide-react";

type Props = { users: TypingUser[] };

export default function TypingIndicator({ users }: Props) {
  if (users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0].firstName} is drafting a verse...`
      : `${users.map((u) => u.firstName).join(", ")} are drafting verses...`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="flex items-center gap-3 px-5 py-2.5 rounded-full w-fit max-w-2xl mx-auto shadow-[0_0_15px_rgba(0,0,0,0.5)] border backdrop-blur-md"
        style={{
          background: "rgba(10,10,10,0.8)",
          borderColor: "rgba(201,168,76,0.2)",
        }}
      >
        <Feather
          size={12}
          className="animate-pulse"
          style={{ color: "var(--accent-gold)" }}
        />

        <span
          className="text-xs font-lora italic tracking-wide"
          style={{ color: "var(--accent-gold)" }}
        >
          {text}
        </span>

        {/* Animated dots */}
        <div className="flex gap-1 ml-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full shadow-[0_0_5px_rgba(201,168,76,0.8)]"
              style={{ background: "var(--accent-gold)" }}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
