"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../lib/axios";
import RoomCard from "../../components/room/RoomCard";
import CreateRoomModal from "../../components/modals/CreateRoomModal";
import { useAuthStore } from "../../store/authStore";

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

const STATUS_FILTERS = ["ALL", "ACTIVE", "COMPLETED", "PAUSED"];

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuthStore();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status && status !== "ALL") params.append("status", status);

      const { data } = await api.get(`/story-rooms?${params.toString()}`);
      setRooms(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const debounce = setTimeout(fetchRooms, 300);
    return () => clearTimeout(debounce);
  }, [fetchRooms, search, status]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-2">
          <h1
            className="font-cinzel text-4xl font-bold tracking-wide"
            style={{
              color: "var(--accent-gold)",
              textShadow: "0 0 20px rgba(201, 168, 76, 0.3)",
            }}
          >
            The Grand Archives
          </h1>
          <p
            className="text-base font-lora italic"
            style={{ color: "var(--text-muted)" }}
          >
            Discover ongoing tales, or forge a new path in the annals of
            history...
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={fetchRooms}
            className="p-3 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center bg-black/20 backdrop-blur-md"
            style={{
              borderColor: "rgba(201, 168, 76, 0.2)",
              color: "var(--text-muted)",
            }}
            title="Refresh Archives"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => setShowModal(true)}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(201,168,76,0.2)] hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-gold), #e8b86d)",
                color: "#1a1a1a",
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out" />
              <Plus size={18} className="relative z-10" />
              <span className="relative z-10 font-cinzel tracking-wider font-bold">
                New Tale
              </span>
            </button>
          ) : (
            <div
              className="px-6 py-3 rounded-xl text-sm font-cinzel border border-dashed"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              Sign in to author
            </div>
          )}
        </div>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="glass-panel p-4 mb-8 rounded-2xl flex flex-col md:flex-row items-center gap-4 shadow-xl">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the archives..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none text-sm transition-all bg-black/40 border border-transparent focus:border-[var(--accent-gold)] focus:bg-black/60 font-lora placeholder-gray-500"
            style={{
              color: "var(--text-primary)",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)",
            }}
          />
        </div>

        {/* Status Filters */}
        <div
          className="flex items-center gap-2 p-1.5 rounded-xl bg-black/40 w-full md:w-auto overflow-x-auto no-scrollbar"
          style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)" }}
        >
          <Filter
            size={16}
            className="ml-3 hidden md:block"
            style={{ color: "var(--text-muted)" }}
          />
          <div className="flex gap-1 pr-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="px-4 py-2.5 rounded-lg text-xs font-cinzel font-bold tracking-wider transition-all duration-300 whitespace-nowrap"
                style={{
                  background:
                    status === s ? "rgba(201,168,76,0.15)" : "transparent",
                  color:
                    status === s ? "var(--accent-gold)" : "var(--text-muted)",
                  border:
                    status === s
                      ? "1px solid rgba(201,168,76,0.3)"
                      : "1px solid transparent",
                  textShadow:
                    status === s ? "0 0 10px rgba(201,168,76,0.3)" : "none",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div className="mb-6 flex items-center justify-between">
        <p
          className="text-sm font-lora italic"
          style={{ color: "var(--text-muted)" }}
        >
          {loading
            ? "Searching..."
            : `Uncovered ${rooms.length} ${rooms.length === 1 ? "tome" : "tomes"}`}
        </p>
      </div>

      {/* Room Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-56 rounded-2xl animate-pulse bg-gradient-to-br from-white/5 to-white/0 border"
              style={{ borderColor: "var(--border)" }}
            />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${search}-${status}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {rooms.map((room, i) => (
              <RoomCard key={room.id} room={room} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!loading && rooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 glass-panel rounded-3xl mx-auto max-w-2xl border"
          style={{ borderColor: "rgba(201, 168, 76, 0.2)" }}
        >
          <div
            className="text-5xl mb-4 animate-bounce"
            style={{ filter: "drop-shadow(0 0 10px rgba(201,168,76,0.3))" }}
          >
            📖
          </div>
          <p
            className="font-cinzel text-2xl mb-2 tracking-wide"
            style={{ color: "var(--accent-gold)" }}
          >
            &quot;The Archives are Empty&quot;
          </p>
          <p
            className="text-base font-lora italic"
            style={{ color: "var(--text-muted)" }}
          >
            {search
              ? "No prophecies match your query. Seek another keyword."
              : "The blank pages yearn for a new author. Will you take up the pen?"}
          </p>
          {isLoggedIn && !search && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-8 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(201,168,76,0.2)] hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-gold), #e8b86d)",
                color: "#1a1a1a",
                fontWeight: "bold",
              }}
            >
              Pen the First Tome →
            </button>
          )}
        </motion.div>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={fetchRooms}
      />
    </div>
  );
}
