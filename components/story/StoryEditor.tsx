
"use client";
import { useState, useRef, useCallback } from "react";
import { Send, Feather } from "lucide-react";

type Props = {
  onSend: (content: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
};

export default function StoryEditor({ onSend, onStartTyping, onStopTyping, disabled }: Props) {
  const [content, setContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  }, [isTyping, onStartTyping, onStopTyping]);

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
    <div className="border rounded-xl p-4"
      style={{ background: "var(--bg-card)", borderColor: "var(--border-gold)" }}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Feather size={14} style={{ color: "var(--accent-gold)" }} />
        <span className="text-xs font-cinzel tracking-wider"
          style={{ color: "var(--accent-gold)" }}>
          YOUR TURN TO WRITE
        </span>
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Continue the story... (Enter to send, Shift+Enter for new line)"
        rows={3}
        className="w-full bg-transparent resize-none outline-none font-lora italic text-base leading-relaxed placeholder:not-italic"
        style={{
          color: "var(--text-primary)",
          caretColor: "var(--accent-gold)",
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t"
        style={{ borderColor: "var(--border)" }}>

        {/* Character count */}
        <span className="text-xs" style={{ color: isOverLimit ? "#f87171" : "var(--text-muted)" }}>
          {charCount}/{maxChar}
        </span>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || disabled || isOverLimit}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            background: content.trim() && !isOverLimit ? "var(--accent-gold)" : "var(--bg-elevated)",
            color: content.trim() && !isOverLimit ? "#000" : "var(--text-muted)",
          }}>
          <Send size={14} />
          Send
        </button>
      </div>
    </div>
  );
}