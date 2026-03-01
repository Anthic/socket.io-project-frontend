// 💡 Real-time collaborative story writing room
// Socket events: join-room, leave-room, add/update/delete-story-line

"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookOpen, ArrowLeft, Users, Settings } from "lucide-react";
import { useRoomStore } from "../../../store/roomStore";
import { useSocket } from "../../../hook/useSocket";
import { useAuthStore } from "../../../store/authStore";
import ParticipantList from "../../../components/story/ParticipantList";
import AIEventBanner from "../../../components/story/AIEventBanner";
import StoryLine from "../../../components/story/StoryLine";
import TypingIndicator from "../../../components/story/TypingIndicator";
import StoryEditor from "../../../components/story/StoryEditor";
import Link from "next/link";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const { storyLines, participants, typingUsers, aiEvent, room, clearRoom } =
    useRoomStore();
  const { sendStoryLine, startTyping, stopTyping, updateLine, deleteLine } =
    useSocket(id);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);

  // Auto-scroll to bottom when new line added
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storyLines.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearRoom();
    };
  }, [clearRoom]);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[var(--bg-primary)]">
      {/* ━━━ LEFT SIDEBAR: Participants ━━━ */}
      <div
        className={`shrink-0 flex flex-col border-r transition-all duration-300 ease-in-out relative z-10 ${
          showSidebar ? "w-72" : "w-0"
        }`}
        style={{
          borderColor: "rgba(201,168,76,0.1)",
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.95), rgba(15,15,15,0.95))",
          boxShadow: showSidebar ? "4px 0 20px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
          {/* Room info */}
          <div className="mb-8 relative">
            <div className="absolute -left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--accent-gold)] to-transparent opacity-50"></div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen
                size={16}
                className="animate-pulse"
                style={{ color: "var(--accent-gold)" }}
              />
              <span
                className="text-xs font-cinzel font-bold tracking-widest"
                style={{
                  color: "var(--accent-gold)",
                  textShadow: "0 0 10px rgba(201,168,76,0.3)",
                }}
              >
                THE TOME
              </span>
            </div>
            <h2
              className="font-cinzel text-lg font-bold leading-snug tracking-wide"
              style={{ color: "var(--text-primary)" }}
            >
              {room?.title || "Loading Manuscript..."}
            </h2>
            {room?.description && (
              <p
                className="text-xs mt-2 font-lora italic leading-relaxed"
                style={{ color: "var(--text-muted)", opacity: 0.8 }}
              >
                {room.description}
              </p>
            )}
          </div>

          <ParticipantList participants={participants} />

          {/* Story stats */}
          {storyLines.length > 0 && (
            <div
              className="mt-8 p-4 rounded-2xl relative overflow-hidden"
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-[var(--accent-gold)] opacity-5 rounded-full blur-xl"></div>
              <p
                className="text-[10px] font-cinzel font-bold tracking-widest mb-3 uppercase"
                style={{ color: "var(--accent-gold)" }}
              >
                Chronicle Stats
              </p>
              <div className="space-y-2 font-lora">
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "var(--text-muted)" }}>
                    Total Verses
                  </span>
                  <span
                    className="font-bold font-cinzel"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {storyLines.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span style={{ color: "var(--text-muted)" }}>
                    Divine Intervention
                  </span>
                  <span
                    className="font-bold font-cinzel flex items-center gap-1"
                    style={{ color: "#a78bfa" }}
                  >
                    {storyLines.filter((l) => l.isAIGenerated).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ━━━ MAIN: Story Area ━━━ */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--accent-gold)] opacity-[0.02] rounded-full blur-[100px] pointer-events-none"></div>

        {/* Top bar */}
        <div
          className="flex items-center gap-4 px-6 py-4 border-b shrink-0 relative z-10 backdrop-blur-md"
          style={{
            borderColor: "rgba(201,168,76,0.1)",
            background: "rgba(10,10,10,0.6)",
          }}
        >
          <button
            onClick={() => router.push("/rooms")}
            className="p-2.5 rounded-xl transition-all duration-300 hover:bg-white/5 hover:scale-110 active:scale-95 group"
            style={{ color: "var(--text-muted)" }}
            title="Back to Archives"
          >
            <ArrowLeft
              size={18}
              className="group-hover:text-[var(--accent-gold)] transition-colors"
            />
          </button>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2.5 rounded-xl transition-all duration-300 hover:bg-white/5 hover:scale-110 active:scale-95"
            style={{
              color: showSidebar ? "var(--accent-gold)" : "var(--text-muted)",
              background: showSidebar ? "rgba(201,168,76,0.1)" : "transparent",
            }}
            title="Toggle Scribes"
          >
            <Users size={18} />
          </button>

          <div className="flex-1 text-center">
            <h1
              className="font-cinzel text-lg font-bold tracking-widest uppercase"
              style={{
                color: "var(--text-primary)",
                textShadow: "0 0 15px rgba(255,255,255,0.1)",
              }}
            >
              {room?.title || "Story Room"}
            </h1>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-[#22c55e]/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]" />
            <span className="text-xs font-bold tracking-wider text-[#22c55e]">
              {participants.length} Active
            </span>
          </div>
        </div>

        {/* Story scroll area */}
        <div className="flex-1 overflow-y-auto px-4 py-8 relative z-10 custom-scrollbar scroll-smooth">
          {/* AI Event Banner */}
          <AIEventBanner event={aiEvent} />

          {storyLines.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 glass-panel rounded-3xl border border-[var(--accent-gold)]/20 animate-fade-in-up">
                <div
                  className="text-6xl mb-6 animate-pulse"
                  style={{
                    filter: "drop-shadow(0 0 15px rgba(201,168,76,0.4))",
                  }}
                >
                  🪶
                </div>
                <p
                  className="font-cinzel text-2xl mb-3"
                  style={{ color: "var(--accent-gold)" }}
                >
                  &quot;The parchment is blank...&quot;
                </p>
                {isLoggedIn ? (
                  <p
                    className="text-sm font-lora italic"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Grasp the quill. Let the ink flow and state your opening
                    verse.
                  </p>
                ) : (
                  <p
                    className="text-sm font-lora italic"
                    style={{ color: "var(--text-muted)" }}
                  >
                    A scribe must reveal themselves before altering destiny.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-w-4xl mx-auto pb-10">
              {storyLines.map((line, i) => (
                <StoryLine
                  key={line.id}
                  line={line}
                  index={i}
                  onUpdate={isLoggedIn ? updateLine : undefined}
                  onDelete={isLoggedIn ? deleteLine : undefined}
                />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Typing Indicator */}
        <div className="px-6 py-2">
          <TypingIndicator users={typingUsers} />
        </div>

        {/* Story Editor — bottom (only for logged in users) */}
        {isLoggedIn ? (
          <div
            className="p-5 border-t relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
            style={{
              borderColor: "rgba(201,168,76,0.1)",
              background: "rgba(10,10,10,0.85)",
            }}
          >
            <div className="max-w-4xl mx-auto">
              <StoryEditor
                onSend={sendStoryLine}
                onStartTyping={startTyping}
                onStopTyping={stopTyping}
              />
            </div>
          </div>
        ) : (
          <div
            className="p-6 border-t text-center relative z-20 backdrop-blur-md"
            style={{
              borderColor: "rgba(201,168,76,0.1)",
              background: "rgba(10,10,10,0.85)",
            }}
          >
            <p
              className="text-sm font-lora italic"
              style={{ color: "var(--text-muted)" }}
            >
              You must{" "}
              <Link
                href={"/auth/login"}
                className="font-cinzel font-bold mx-1 hover:underline underline-offset-4"
                style={{ color: "var(--accent-gold)" }}
              >
                present your credentials
              </Link>{" "}
              to weave your destiny into this tale.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
