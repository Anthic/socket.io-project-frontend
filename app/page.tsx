// 💡 Homepage — 3D Hero Section & Smooth Scroll

"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Zap,
  Feather,
  ArrowRight,
  Shield,
} from "lucide-react";
import Hero3D from "../components/home/Hero3D"; // Our new 3D component
import { useAuthStore } from "../store/authStore";

export default function HomePage() {
  const { isLoggedIn } = useAuthStore();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-[var(--text-primary)]">
      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4">
        {/* 3D Background */}
        <Hero3D />

        <div className="container mx-auto max-w-6xl z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-6"
          >
            <motion.div variants={fadeIn} className="flex justify-center mb-4">
              <span className="px-4 py-1.5 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--bg-card)]/50 backdrop-blur-md text-[var(--accent-gold)] text-sm font-cinzel tracking-wider">
                ✨ Next-Gen Storytelling
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl font-cinzel font-bold leading-tight"
            >
              Where AI Meets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-gold)] to-purple-400">
                Human Imagination
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl font-lora italic text-[var(--text-muted)] max-w-2xl mx-auto"
            >
              Collaborate with friends and AI to weave unforgettable tales in
              real-time. The story never ends when imagination has no limits.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            >
              <Link href={isLoggedIn ? "/rooms" : "/auth/register"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[var(--accent-gold)] to-yellow-600 text-black font-bold text-xl flex items-center gap-3 relative overflow-hidden group"
                  style={{ boxShadow: "0 0 30px rgba(251,191,36,0.3)" }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Story <ArrowRight size={24} />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </motion.button>
              </Link>
              <Link href="#features">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-sm hover:bg-white/10 hover:border-[var(--accent-gold)] transition-all font-semibold text-xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  Explore Features
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <div className="w-6 h-10 rounded-full border-2 border-[var(--text-muted)] flex justify-center pt-2">
            <div className="w-1 h-2 bg-[var(--accent-gold)] rounded-full animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* ━━━ FEATURES SECTION ━━━ */}
      <section
        id="features"
        className="py-24 px-4 bg-[var(--bg-secondary)] relative"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-4xl font-cinzel font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Why Create With Us?
            </h2>
            <p className="text-[var(--text-muted)] font-lora text-lg">
              Immersive tools for the modern storyteller
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap size={32} className="text-yellow-400" />}
              title="Real-time AI Twists"
              description="Our AI engine analyzes your story flow and injects surprising plot twists precisely when you need inspiration."
            />
            <FeatureCard
              icon={<Users size={32} className="text-purple-400" />}
              title="Multiplayer Writing"
              description="Create private rooms, invite friends, and write together in real-time with live typing indicators."
            />
            <FeatureCard
              icon={<Shield size={32} className="text-green-400" />}
              title="Secure & Private"
              description="Your stories are encrypted and safe. You control who enters your room and who contributes."
            />
          </div>
        </div>
      </section>

      {/* ━━━ CTA SECTION ━━━ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--accent-gold)]/5 -z-10" />
        <div className="container mx-auto max-w-4xl text-center">
          <h2
            className="text-4xl md:text-5xl font-cinzel font-bold mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Ready to Write History?
          </h2>
          <p className="text-xl text-[var(--text-muted)] mb-10 font-lora">
            Join thousands of writers creating new worlds today.
          </p>
          <Link href="/auth/register">
            <button className="px-10 py-4 rounded-xl bg-gradient-to-r from-[var(--accent-gold)] to-yellow-600 text-black font-bold text-xl hover:shadow-lg hover:shadow-yellow-500/20 transition-all transform hover:-translate-y-1">
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)] bg-[var(--bg-secondary)] text-center text-[var(--text-muted)] text-sm">
        <p>© 2026 StorySocket. Made with 💛 by 3D Web Designers.</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent-gold)] transition-colors group"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
    >
      <div className="mb-6 p-4 rounded-full bg-[var(--bg-primary)] w-fit group-hover:bg-white/5 transition-colors">
        {icon}
      </div>
      <h3
        className="text-xl font-bold mb-3 font-cinzel"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p className="text-[var(--text-muted)] leading-relaxed font-lora">
        {description}
      </p>
    </motion.div>
  );
}
