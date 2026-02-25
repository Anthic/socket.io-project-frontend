// 💡 Homepage — আকর্ষণীয় hero section

"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users, Zap, Feather } from "lucide-react";

const features = [
  { icon: Users,    title: "Collaborative",   desc: "Write stories with people worldwide in real-time" },
  { icon: Zap,      title: "AI Twists",       desc: "Random plot twists injected by our story AI" },
  { icon: Feather,  title: "Your Story",      desc: "Every line matters. Every word counts." },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">

      {/* Hero */}
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 text-sm"
            style={{ borderColor: "var(--border-gold)", color: "var(--accent-gold)", background: "rgba(201,168,76,0.08)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live stories happening now
          </div>

          <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ color: "var(--text-primary)" }}>
            Write Stories
            <br />
            <span style={{ color: "var(--accent-gold)" }}>Together.</span>
          </h1>

          <p className="font-lora italic text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}>
            "Join a room. Add a line. Shape the story."
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/rooms"
              className="px-8 py-3 rounded-lg font-semibold text-base transition-all hover:scale-105"
              style={{ background: "var(--accent-gold)", color: "#000" }}>
              Browse Rooms
            </Link>
            <Link href="/register"
              className="px-8 py-3 rounded-lg font-semibold text-base border transition-all hover:border-amber-400"
              style={{ borderColor: "var(--border-gold)", color: "var(--text-primary)" }}>
              Start Writing
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="rounded-xl p-6 border text-center"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="inline-flex p-3 rounded-lg mb-4"
              style={{ background: "rgba(201,168,76,0.1)" }}>
              <f.icon size={20} style={{ color: "var(--accent-gold)" }} />
            </div>
            <h3 className="font-cinzel font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {f.title}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}