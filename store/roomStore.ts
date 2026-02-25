

import { create } from "zustand";

export type StoryLine = {
  id: string;
  content: string;
  lineNumber: number;
  isAIGenerated: boolean;
  author: {
    id: string;
    firstName: string;
    lastName?: string | null;
    image?: string | null;
  };
  createdAt: string;
};

export type Participant = {
  id: string;
  firstName: string;
  lastName?: string;
  image?: string | null;
};

export type TypingUser = {
  id: string;
  firstName: string;
};

export type RoomInfo = {
  id: string;
  title: string;
  description?: string;
};

type RoomStore = {
  room: RoomInfo | null;
  storyLines: StoryLine[];
  participants: Participant[];
  typingUsers: TypingUser[];
  aiEvent: string | null;

  setRoom: (room: RoomInfo) => void;
  setStoryLines: (lines: StoryLine[]) => void;
  addStoryLine: (line: StoryLine) => void;
  updateStoryLine: (line: StoryLine) => void;
  removeStoryLine: (lineId: string) => void;

  setParticipants: (p: Participant[]) => void;
  addParticipant: (p: Participant) => void;
  removeParticipant: (userId: string) => void;

  addTypingUser: (u: TypingUser) => void;
  removeTypingUser: (userId: string) => void;

  setAiEvent: (event: string | null) => void;
  clearRoom: () => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  storyLines: [],
  participants: [],
  typingUsers: [],
  aiEvent: null,

  setRoom: (room) => set({ room }),

  setStoryLines: (lines) => set({ storyLines: lines }),

  addStoryLine: (line) =>
    set((s) => ({
      storyLines: [...s.storyLines, line],
    })),

  updateStoryLine: (line) =>
    set((s) => ({
      storyLines: s.storyLines.map((l) => (l.id === line.id ? line : l)),
    })),

  removeStoryLine: (lineId) =>
    set((s) => ({
      storyLines: s.storyLines.filter((l) => l.id !== lineId),
    })),

  setParticipants: (participants) => set({ participants }),

  addParticipant: (p) =>
    set((s) => ({
      participants: s.participants.find((x) => x.id === p.id)
        ? s.participants
        : [...s.participants, p],
    })),

  removeParticipant: (userId) =>
    set((s) => ({
      participants: s.participants.filter((p) => p.id !== userId),
    })),

  addTypingUser: (u) =>
    set((s) => ({
      typingUsers: s.typingUsers.find((x) => x.id === u.id)
        ? s.typingUsers
        : [...s.typingUsers, u],
    })),

  removeTypingUser: (userId) =>
    set((s) => ({
      typingUsers: s.typingUsers.filter((u) => u.id !== userId),
    })),

  setAiEvent: (event) => set({ aiEvent: event }),

  clearRoom: () =>
    set({
      room: null,
      storyLines: [],
      participants: [],
      typingUsers: [],
      aiEvent: null,
    }),
}));