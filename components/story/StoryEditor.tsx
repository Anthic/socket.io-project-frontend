"use client";
import { useState, useRef, useCallback } from "react";
import { Send, Feather } from "lucide-react";

type Props = {
  onSend: (content: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
};

export default function StoryEditor({
  onSend,
  onStartTyping,
  onStopTyping,
  disabled,
}: Props) {
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);

      // Typing started
      if (!isTyping) {
        setIsTyping(true);
        onStartTyping();
      }

      // Reset timeout — 1.5s পরে stop typing emit
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        setIsTyping(false);
        onStopTyping();
      }, 1500);
    },
    [isTyping, onStartTyping, onStopTyping],
  );

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    // Stop typing first
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    setIsTyping(false);
    onStopTyping();

    onSend(trimmed);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = content.length;
  const maxChar = 500;
  const isOverLimit = charCount > maxChar;

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(10,10,10,0.6)",
        border: "1px solid rgba(201,168,76,0.3)",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.3)",
      }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-1/2 h-full bg-[var(--accent-gold)] opacity-5 blur-2xl pointer-events-none rounded-full"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[var(--accent-gold)]/10">
            <Feather
              size={14}
              className="animate-pulse"
              style={{ color: "var(--accent-gold)" }}
            />
          </div>
          <span
            className="text-xs font-cinzel font-bold tracking-widest uppercase"
            style={{
              color: "var(--accent-gold)",
              textShadow: "0 0 10px rgba(201,168,76,0.3)",
            }}
          >
            Draft Your Verse
          </span>
        </div>
        {/* Animated indicator when typing */}
        {isTyping && (
          <span className="text-[10px] font-lora italic text-[var(--accent-gold)] animate-pulse">
            Ink is flowing...
          </span>
        )}
      </div>

      {/* Textarea */}
      <div className="relative z-10">
        <textarea
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Continue the ancient tale... (Press Enter to pen, Shift+Enter for a new line)"
          rows={3}
          className="w-full bg-transparent resize-none outline-none font-lora italic text-lg leading-relaxed placeholder:text-gray-600/50 custom-scrollbar"
          style={{
            color: "var(--text-primary)",
            caretColor: "var(--accent-gold)",
          }}
        />
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-4 pt-4 relative z-10"
        style={{ borderTop: "1px dashed rgba(201,168,76,0.2)" }}
      >
        {/* Character count */}
        <div className="flex items-center gap-2">
          <div className="h-1 w-24 bg-black/50 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((charCount / maxChar) * 100, 100)}%`,
                background: isOverLimit ? "#ef4444" : "var(--accent-gold)",
                boxShadow: `0 0 10px ${isOverLimit ? "#ef4444" : "var(--accent-gold)"}`,
              }}
            ></div>
          </div>
          <span
            className="text-[10px] font-mono"
            style={{ color: isOverLimit ? "#ef4444" : "var(--text-muted)" }}
          >
            {charCount}/{maxChar}
          </span>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || disabled || isOverLimit}
          className="group flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold font-cinzel tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(201,168,76,0)] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] relative overflow-hidden"
          style={{
            background:
              content.trim() && !isOverLimit
                ? "linear-gradient(135deg, var(--accent-gold), #e8b86d)"
                : "var(--bg-elevated)",
            color:
              content.trim() && !isOverLimit ? "#1a1a1a" : "var(--text-muted)",
            border:
              content.trim() && !isOverLimit
                ? "none"
                : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {content.trim() && !isOverLimit && (
            <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out"></div>
          )}
          <Send
            size={16}
            className={`relative z-10 ${content.trim() && !isOverLimit ? "group-hover:translate-x-1 transition-transform" : ""}`}
          />
          <span className="relative z-10">Inscribe</span>
        </button>
      </div>
    </div>
  );
}
