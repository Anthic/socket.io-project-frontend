
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: string
    firstName : string;
    lastName? : string;
    email : string
    role : string
    image?: string
}

type AuthStore = {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isLoggedIn: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, isLoggedIn: false }),
    }),
    { name: "auth-storage" }
  )
);
