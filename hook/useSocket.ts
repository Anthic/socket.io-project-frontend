// 💡 সবচেয়ে গুরুত্বপূর্ণ hook
// Socket events listen করে → Zustand store update করে
// component unmount হলে cleanup করে

"use client";
import { useEffect, useRef } from "react";
import { useRoomStore } from "../store/roomStore";
import { getSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
// optional toast library

export const useSocket = (roomId: string) => {
  const { accessToken } = useAuthStore();
  const {
    setRoom,
    setStoryLines,
    addStoryLine,
    updateStoryLine,
    removeStoryLine,
    setParticipants,
    addParticipant,
    removeParticipant,
    addTypingUser,
    removeTypingUser,
    setAiEvent,
  } = useRoomStore();

  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);

  useEffect(() => {
    if (!accessToken || !roomId) {
      console.warn("⚠️ Socket not initialized - missing:", {
        hasToken: !!accessToken,
        hasRoomId: !!roomId,
      });
      return;
    }

    console.log(
      "🔌 Initializing socket connection with token:",
      accessToken.substring(0, 20) + "...",
    );

    // 🔧 Create or update socket with current token
    if (!socketRef.current) {
      socketRef.current = getSocket(accessToken);
    } else {
      // Update auth token if socket already exists
      socketRef.current.auth = { token: accessToken };
    }

    const socket = socketRef.current;

    // 🔍 Connection event listeners for debugging
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    if (!socket.connected) {
      socket.connect();
    }

    // Room join
    socket.emit("join-room", { roomId });

    socket.on("room-joined", ({ room }) => {
      setRoom({
        id: room.id,
        title: room.title,
        description: room.description,
      });
      setParticipants(room.participants);
      setStoryLines(room.storyLines);
    });

    // নতুন line (অন্য কেউ লিখেছে)
    socket.on("new-story-line", (line) => addStoryLine(line));

    // তোমার line confirmed (তুমি লিখেছিলে)
    socket.on("story-line-added", (line) => addStoryLine(line));

    // Line edited
    socket.on("story-line-updated", (line) => updateStoryLine(line));

    // Line deleted
    socket.on("story-line-deleted", ({ lineId }) => removeStoryLine(lineId));

    // কেউ join করলো
    socket.on("user-joined-room", ({ user }) => addParticipant(user));

    // কেউ চলে গেলে
    socket.on("user-left-room", ({ userId }) => removeParticipant(userId));

    // Typing indicators
    socket.on("user-typing", ({ user }) => addTypingUser(user));
    socket.on("user-stopped-typing", ({ user }) => removeTypingUser(user.id));

    // AI Plot Twist!
    socket.on("ai-event-triggered", ({ event }) => {
      setAiEvent(event);
      setTimeout(() => setAiEvent(null), 6000); // 6s পরে সরাও
    });

    // Error handling
    socket.on("error", ({ message }) => {
      console.error("Socket error:", message);
    });

    // Cleanup function
    return () => {
      socket.emit("leave-room", { roomId });
      socket.off("connect");
      socket.off("connect_error");
      socket.off("room-joined");
      socket.off("new-story-line");
      socket.off("story-line-added");
      socket.off("story-line-updated");
      socket.off("story-line-deleted");
      socket.off("user-joined-room");
      socket.off("user-left-room");
      socket.off("user-typing");
      socket.off("user-stopped-typing");
      socket.off("ai-event-triggered");
      socket.off("error");
    };
  }, [roomId, accessToken]);

  // ━━━ CLIENT → SERVER EMITTERS ━━━

  const sendStoryLine = (content: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("add-story-line", { roomId, content });
  };

  const startTyping = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("start-typing", { roomId });
  };

  const stopTyping = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("stop-typing", { roomId });
  };
  const updateLine = (lineId: string, content: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("update-story-line", { roomId, lineId, content });
  };
  const deleteLine = (lineId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("delete-story-line", { roomId, lineId });
  };
  return { sendStoryLine, startTyping, stopTyping, updateLine, deleteLine };
};
