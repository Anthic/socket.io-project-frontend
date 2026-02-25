

"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users, BookOpen, Clock, Lock, Globe } from "lucide-react";

type Room = {
  id: string;
  title: string;
  description?: string;
  status: string;
  isPublic: boolean;
  maxParticipants: number;
  creator: { firstName: string };
  _count: { participants: number; storyLines: number };
  createdAt: string;
};

export default function RoomCard({ room, index }: { room: Room; index: number }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => router.push(`/rooms/${room.id}`)}
      className="cursor-pointer rounded-xl p-5 border transition-all hover:scale-[1.02] hover:-translate-y-1"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
      whileHover={{ borderColor: "rgba(201,168,76,0.4)", boxShadow: "var(--glow-gold)" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {room.isPublic
            ? <Globe size={14} style={{ color: "var(--text-muted)" }} />
            : <Lock size={14} style={{ color: "var(--text-muted)" }} />}
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            room.status === "ACTIVE"
              ? "bg-green-900/40 text-green-400"
              : "bg-gray-800 text-gray-400"
          }`}>
            {room.status}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          by {room.creator.firstName}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-cinzel font-semibold text-base mb-2"
        style={{ color: "var(--text-primary)" }}>
        {room.title}
      </h3>

      {/* Description */}
      {room.description && (
        <p className="text-sm mb-4 line-clamp-2 font-lora italic"
          style={{ color: "var(--text-muted)" }}>
          {room.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-1.5">
          <Users size={12} style={{ color: "var(--text-muted)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {room._count.participants}/{room.maxParticipants}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen size={12} style={{ color: "var(--text-muted)" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {room._count.storyLines} lines
          </span>
        </div>
      </div>
    </motion.div>
  );
}