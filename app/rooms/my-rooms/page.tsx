"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, BookOpen, Trash2, Edit2, Loader2, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../lib/axios";
import RoomCard from "../../../components/room/RoomCard";
import CreateRoomModal from "../../../components/modals/CreateRoomModal";
import { useAuthStore } from "../../../store/authStore";

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

export default function MyRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const fetchMyRooms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/story-rooms/my-rooms");
      setRooms(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }
    fetchMyRooms();
  }, [isLoggedIn, router, fetchMyRooms]);

  const handleDelete = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room? This cannot be undone.")) return;
    setDeletingId(roomId);
    try {
      await api.delete(`/story-rooms/${roomId}`);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete room");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} style={{ color: "var(--accent-gold)" }} />
            <h1 className="font-cinzel text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
              My Story Rooms
            </h1>
          </div>
          <p className="text-sm font-lora italic" style={{ color: "var(--text-muted)" }}>
            Manage the worlds you&apos;ve created
          </p>
        </div>
        <button
          id="my-rooms-create"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8b86d)",
            color: "#000",
            boxShadow: "0 4px 16px rgba(201,168,76,0.25)",
          }}
        >
          <Plus size={16} />
          New Room
        </button>
      </div>

      {/* Stats bar */}
      {!loading && rooms.length > 0 && (
        <div
          className="flex items-center gap-6 p-4 rounded-xl mb-6"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div>
            <span className="text-2xl font-bold font-cinzel" style={{ color: "var(--accent-gold)" }}>
              {rooms.length}
            </span>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Rooms</p>
          </div>
          <div className="w-px h-8" style={{ background: "var(--border)" }} />
          <div>
            <span className="text-2xl font-bold font-cinzel" style={{ color: "#4ade80" }}>
              {rooms.filter((r) => r.status === "ACTIVE").length}
            </span>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Active</p>
          </div>
          <div className="w-px h-8" style={{ background: "var(--border)" }} />
          <div>
            <span className="text-2xl font-bold font-cinzel" style={{ color: "var(--text-secondary)" }}>
              {rooms.reduce((sum, r) => sum + r._count.storyLines, 0)}
            </span>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total Lines Written</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl animate-pulse" style={{ background: "var(--bg-card)" }} />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <div className="text-5xl mb-4">🪶</div>
          <p className="font-lora italic text-xl mb-2" style={{ color: "var(--text-muted)" }}>
            &quot;Every story begins with a blank page.&quot;
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            You haven&apos;t created any story rooms yet.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8b86d)",
              color: "#000",
              boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
            }}
          >
            Create Your First Room →
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.07 }}
                className="relative group"
              >
                <RoomCard room={room} index={i} />

                {/* Action buttons overlay */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => router.push(`/rooms/${room.id}`)}
                    className="p-1.5 rounded-lg text-xs transition-all hover:scale-110"
                    style={{ background: "rgba(201,168,76,0.2)", color: "var(--accent-gold)" }}
                    title="Open Room"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    disabled={deletingId === room.id}
                    className="p-1.5 rounded-lg text-xs transition-all hover:scale-110 disabled:opacity-50"
                    style={{ background: "rgba(159,18,57,0.2)", color: "#f87171" }}
                    title="Delete Room"
                  >
                    {deletingId === room.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={fetchMyRooms}
      />
    </div>
  );
}
