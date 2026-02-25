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
    setRoom, setStoryLines, addStoryLine, updateStoryLine, removeStoryLine,
    setParticipants, addParticipant, removeParticipant,
    addTypingUser, removeTypingUser, setAiEvent,
  } = useRoomStore();

  const socketRef = useRef(getSocket(accessToken!));

  useEffect(() => {
    if (!accessToken || !roomId) return;

    const socket = socketRef.current;

    // Room join 
    socket.emit("join-room", { roomId });


    socket.on("room-joined", ({ room }) => {
      setRoom({ id: room.id, title: room.title, description: room.description });
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
    socketRef.current.emit("add-story-line", { roomId, content });
  };

  const startTyping = () => {
    socketRef.current.emit("start-typing", { roomId });
  };

  const stopTyping = () => {
    socketRef.current.emit("stop-typing", { roomId });
  };

  return { sendStoryLine, startTyping, stopTyping };
};