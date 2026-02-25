// 💡 কোন page এ আছো সেই context দেখায়
// Login থাকলে → user menu
// না থাকলে → Login/Register button

"use client";
import Link from "next/link";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import { BookOpen, LogOut, User, Home, LogOutIcon } from "lucide-react";



export default function Navbar() {
  const { user, isLoggedIn, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.patch("/auth/logout", { email: user?.email });
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{ background: "rgba(9,8,10,0.95)", borderColor: "var(--border-gold)", backdropFilter: "blur(10px)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-cinzel text-xl font-bold"
          style={{ color: "var(--accent-gold)" }}>
          <BookOpen size={22} />
          The Dark Library
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/rooms" className="text-sm hover:text-amber-400 transition-colors"
                style={{ color: "var(--text-secondary)" }}>
                Story Rooms
              </Link>
              <Link href="/rooms/my-rooms" className="text-sm hover:text-amber-400 transition-colors"
                style={{ color: "var(--text-secondary)" }}>
                My Rooms
              </Link>

              {/* User info */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ background: "var(--accent-gold)", color: "#000" }}>
                    {user?.firstName[0].toUpperCase()}
                  </div>
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {user?.firstName}
                  </span>
                </div>
                <button onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-900/30 transition-colors"
                  title="Logout">
                  <LogOutIcon size={16} style={{ color: "var(--text-muted)" }} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login"
                className="px-4 py-2 text-sm rounded-lg border transition-all hover:border-amber-400"
                style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                Login
              </Link>
              <Link href="/register"
                className="px-4 py-2 text-sm rounded-lg font-medium transition-all"
                style={{ background: "var(--accent-gold)", color: "#000" }}>
                Start Writing
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}