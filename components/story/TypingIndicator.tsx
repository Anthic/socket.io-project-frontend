// 💡 "Sarah is typing..." indicator
// Animated dots দিয়ে

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TypingUser } from "../../store/roomStore";


type Props = { users: TypingUser[] };

export default function TypingIndicator({ users }: Props) {
  if (users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0].firstName} is writing...`
      : `${users.map((u) => u.firstName).join(", ")} are writing...`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        className="flex items-center gap-2 px-4 py-2">

        {/* Animated dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent-gold)" }}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>

        <span className="text-xs italic" style={{ color: "var(--text-muted)" }}>
          {text}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}