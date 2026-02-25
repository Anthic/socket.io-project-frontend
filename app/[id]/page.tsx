// 💡 সবচেয়ে গুরুত্বপূর্ণ page — real-time story writing

"use client";
import { useParams } from "next/navigation";

import { useEffect, useRef } from "react";
import { BookOpen } from "lucide-react";
import { useRoomStore } from "../../store/roomStore";
import { useSocket } from "../../hook/useSocket";
import ParticipantList from "../../components/story/ParticipantList";
import AIEventBanner from "../../components/story/AIEventBanner";
import StoryLine from "../../components/story/StoryLine";
import TypingIndicator from "../../components/story/TypingIndicator";
import StoryEditor from "../../components/story/StoryEditor";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const { storyLines, participants, typingUsers, aiEvent, room } = useRoomStore();
  const { sendStoryLine, startTyping, stopTyping } = useSocket(id);

  // Auto-scroll to bottom when new line added
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storyLines.length]);

  return (
    <div className="flex h-[calc(100vh-64px)]">

      {/* ━━━ LEFT SIDEBAR: Participants ━━━ */}
      <div className="w-64 shrink-0 p-4 border-r overflow-y-auto"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>

        {/* Room title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={14} style={{ color: "var(--accent-gold)" }} />
            <span className="text-xs font-cinzel tracking-wider" style={{ color: "var(--accent-gold)" }}>
              STORY ROOM
            </span>
          </div>
          <h2 className="font-cinzel font-semibold" style={{ color: "var(--text-primary)" }}>
            {room?.title || "Loading..."}
          </h2>
          {room?.description && (
            <p className="text-xs mt-1 font-lora italic" style={{ color: "var(--text-muted)" }}>
              {room.description}
            </p>
          )}
        </div>

        <ParticipantList participants={participants} />
      </div>

      {/* ━━━ MAIN: Story Area ━━━ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Story scroll area */}
        <div className="flex-1 overflow-y-auto px-2 py-4"
          style={{ background: "var(--bg-primary)" }}>

          {/* AI Event Banner — top এ fixed */}
          <AIEventBanner event={aiEvent} />

          {storyLines.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="font-lora italic text-lg" style={{ color: "var(--text-muted)" }}>
                "Once upon a time..."
                <br />
                <span className="text-sm mt-2 block text-center">Be the first to write!</span>
              </p>
            </div>
          ) : (
            <div className="space-y-1 max-w-3xl mx-auto">
              {storyLines.map((line, i) => (
                <StoryLine key={line.id} line={line} index={i} />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Typing Indicator */}
        <TypingIndicator users={typingUsers} />

        {/* Story Editor — bottom */}
        <div className="p-4 border-t" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="max-w-3xl mx-auto">
            <StoryEditor
              onSend={sendStoryLine}
              onStartTyping={startTyping}
              onStopTyping={stopTyping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}