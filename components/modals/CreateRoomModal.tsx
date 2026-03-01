"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Users, Globe, Lock, Loader2 } from "lucide-react";
import api from "../../lib/axios";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateRoomModal({ isOpen, onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    maxParticipants: 10,
    isPublic: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/story-rooms", form);
      onCreated();
      onClose();
      setForm({ title: "", description: "", maxParticipants: 10, isPublic: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-2xl p-6 pointer-events-auto"
              style={{
                background: "rgba(26, 23, 32, 0.98)",
                border: "1px solid rgba(201,168,76,0.3)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,168,76,0.08)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <BookOpen size={18} style={{ color: "var(--accent-gold)" }} />
                  </div>
                  <div>
                    <h2 className="font-cinzel font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                      New Story Room
                    </h2>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Create a collaborative writing space
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm"
                  style={{ background: "rgba(159,18,57,0.15)", border: "1px solid rgba(159,18,57,0.3)", color: "#f87171" }}
                >
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                    Room Title *
                  </label>
                  <input
                    id="room-title"
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="The Midnight Chronicles..."
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-xl outline-none text-sm font-lora italic transition-all"
                    style={{
                      background: "rgba(34,31,42,0.8)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      caretColor: "var(--accent-gold)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(201,168,76,0.5)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                    Description
                  </label>
                  <textarea
                    id="room-description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="What is this story about?"
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl outline-none text-sm font-lora italic resize-none transition-all"
                    style={{
                      background: "rgba(34,31,42,0.8)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      caretColor: "var(--accent-gold)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(201,168,76,0.5)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Max Participants */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                    Max Writers
                  </label>
                  <div className="flex items-center gap-3">
                    <Users size={16} style={{ color: "var(--text-muted)" }} />
                    <input
                      id="room-max"
                      type="number"
                      min={2}
                      max={50}
                      value={form.maxParticipants}
                      onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
                      className="flex-1 px-4 py-3 rounded-xl outline-none text-sm transition-all"
                      style={{
                        background: "rgba(34,31,42,0.8)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                        caretColor: "var(--accent-gold)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(201,168,76,0.5)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--border)";
                      }}
                    />
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isPublic: true })}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: form.isPublic ? "rgba(201,168,76,0.15)" : "rgba(34,31,42,0.8)",
                      border: `1px solid ${form.isPublic ? "rgba(201,168,76,0.5)" : "var(--border)"}`,
                      color: form.isPublic ? "var(--accent-gold)" : "var(--text-muted)",
                    }}
                  >
                    <Globe size={14} />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isPublic: false })}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: !form.isPublic ? "rgba(201,168,76,0.15)" : "rgba(34,31,42,0.8)",
                      border: `1px solid ${!form.isPublic ? "rgba(201,168,76,0.5)" : "var(--border)"}`,
                      color: !form.isPublic ? "var(--accent-gold)" : "var(--text-muted)",
                    }}
                  >
                    <Lock size={14} />
                    Private
                  </button>
                </div>

                {/* Submit */}
                <button
                  id="create-room-submit"
                  type="submit"
                  disabled={loading || !form.title.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #c9a84c, #e8b86d)",
                    color: "#000",
                    boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "✨ Create Story Room"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
