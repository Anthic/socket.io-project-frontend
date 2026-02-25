import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/NavBar";


export const metadata: Metadata = {
  title: "The Dark Library — Collaborative Storytelling",
  description: "Write stories together in real-time",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}