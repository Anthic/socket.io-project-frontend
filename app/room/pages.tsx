"use client";
import { useEffect, useState } from "react";

import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../lib/axios";
import RoomCard from "../../components/room/RoomCard";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRooms = async () => {
    try {
      const { data } = await api.get(`/story-rooms?search=${search}`);
      setRooms(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Story Rooms
          </h1>
          <p className="text-sm mt-1 font-lora italic" style={{ color: "var(--text-muted)" }}>
            Join a room and add your chapter...
          </p>
        </div>
        <button
          onClick={() => {/* open CreateRoomModal */}}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105"
          style={{ background: "var(--accent-gold)", color: "#000" }}>
          <Plus size={16} />
          New Room
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-3.5" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search stories..."
          className="w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm border"
          style={{ background: "var(--bg-card)", color: "var(--text-primary)", borderColor: "var(--border)" }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-44 rounded-xl animate-pulse" style={{ background: "var(--bg-card)" }} />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room: any, i) => (
            <RoomCard key={room.id} room={room} index={i} />
          ))}
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <div className="text-center py-20">
          <p className="font-lora italic text-xl" style={{ color: "var(--text-muted)" }}>
            "No stories found. Be the first to write one."
          </p>
        </div>
      )}
    </div>
  );
}