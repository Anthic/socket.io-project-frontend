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
      await api.post("/auth/logout", { email: user?.email });
    } finally {
      clearAuth();
      router.push("/auth/login");
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "rgba(9,8,10,0.95)",
        borderColor: "var(--border-gold)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-cinzel text-xl font-bold"
          style={{ color: "var(--accent-gold)" }}
        >
          <BookOpen size={22} />
          The Dark Library
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/rooms"
                className="text-sm font-medium hover:text-amber-400 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                Story Rooms
              </Link>
              <Link
                href="/rooms/my-rooms"
                className="text-sm font-medium hover:text-amber-400 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                My Rooms
              </Link>

              {/* User info */}
              <div
                className="flex items-center gap-3 ml-4 pl-4 border-l"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent-gold), #e8b86d)",
                      color: "#000",
                    }}
                  >
                    {user?.firstName?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span
                    className="text-sm font-medium mr-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {user?.firstName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-rose-400 hover:text-rose-500"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-5 py-2 text-sm rounded-lg border transition-all hover:bg-white/5 hover:text-white"
                style={{
                  color: "var(--text-secondary)",
                  borderColor: "var(--border-gold)",
                }}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2 text-sm rounded-lg font-bold transition-all shadow-lg hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-gold), #e8b86d)",
                  color: "#000",
                  boxShadow: "0 4px 15px rgba(201, 168, 76, 0.2)",
                }}
              >
                Start Writing
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
