"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users, BookOpen, Clock, Lock, Globe, Sparkles } from "lucide-react";

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

export default function RoomCard({
  room,
  index,
}: {
  room: Room;
  index: number;
}) {
  const router = useRouter();

  const getStatusStyles = () => {
    switch (room.status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "COMPLETED":
        return "bg-amber-500/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => router.push(`/rooms/${room.id}`)}
      className="group relative cursor-pointer rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col h-full bg-black/40 backdrop-blur-md"
      style={{
        borderColor: "rgba(201,168,76,0.1)",
      }}
      whileHover={{
        borderColor: "var(--accent-gold)",
        boxShadow:
          "0 0 30px rgba(201,168,76,0.15), inset 0 0 20px rgba(201,168,76,0.05)",
      }}
    >
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-gold)]/0 via-transparent to-[var(--accent-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header Info */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex flex-col gap-2">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${getStatusStyles()} flex items-center justify-center w-fit`}
          >
            {room.status === "ACTIVE" && (
              <Sparkles size={10} className="mr-1.5 animate-pulse" />
            )}
            {room.status}
          </span>
          <div
            className="flex items-center gap-1.5 text-xs font-lora"
            style={{ color: "var(--text-muted)" }}
          >
            {room.isPublic ? <Globe size={12} /> : <Lock size={12} />}
            <span>{room.isPublic ? "Public Realm" : "Private Sanctum"}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow relative z-10">
        <h3
          className="font-cinzel font-bold text-xl mb-3 line-clamp-2 leading-tight transition-colors duration-300 group-hover:text-[var(--accent-gold)]"
          style={{ color: "var(--text-primary)" }}
        >
          {room.title}
        </h3>

        <p
          className="text-sm line-clamp-3 font-lora italic leading-relaxed"
          style={{ color: "var(--text-muted)", opacity: 0.8 }}
        >
          {room.description || "A forgotten manuscript awaiting its authors..."}
        </p>
      </div>

      {/* Card Footer (Author & Stats) */}
      <div
        className="mt-6 pt-4 border-t relative z-10 flex flex-col gap-3"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-cinzel text-xs font-bold"
            style={{
              background: "rgba(201,168,76,0.2)",
              color: "var(--accent-gold)",
            }}
          >
            {room.creator.firstName.charAt(0).toUpperCase()}
          </div>
          <span
            className="text-xs font-lora italic"
            style={{ color: "var(--text-muted)" }}
          >
            Seeded by {room.creator.firstName}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/30"
              title="Scribes"
            >
              <Users size={12} style={{ color: "var(--accent-gold)" }} />
              <span
                className="text-xs font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {room._count.participants}
                <span
                  className="text-[10px]"
                  style={{ color: "var(--text-muted)" }}
                >
                  /{room.maxParticipants}
                </span>
              </span>
            </div>

            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/30"
              title="Verses"
            >
              <BookOpen size={12} className="text-purple-400" />
              <span
                className="text-xs font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {room._count.storyLines}
              </span>
            </div>
          </div>

          <div
            className="text-[10px] font-lora uppercase tracking-wider"
            style={{ color: "var(--text-muted)", opacity: 0.6 }}
          >
            {new Date(room.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
