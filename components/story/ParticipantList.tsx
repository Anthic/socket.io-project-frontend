"use client";

import { Users, Crown } from "lucide-react";
import { Participant } from "../../store/roomStore";

type Props = { participants: Participant[] };

export default function ParticipantList({ participants }: Props) {
  return (
    <div
      className="rounded-2xl p-5 border relative overflow-hidden backdrop-blur-md"
      style={{
        background: "rgba(0,0,0,0.4)",
        borderColor: "rgba(201,168,76,0.15)",
      }}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-gold)] opacity-[0.03] rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <Users size={16} style={{ color: "var(--accent-gold)" }} />
          <span
            className="text-[10px] font-cinzel font-bold tracking-widest uppercase"
            style={{ color: "var(--accent-gold)" }}
          >
            Current Scribes
          </span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]">
          {participants.length}
        </span>
      </div>

      <div className="space-y-3 relative z-10 custom-scrollbar max-h-[30vh] overflow-y-auto pr-2">
        {participants.map((p, index) => (
          <div
            key={p.id}
            className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-cinzel font-bold shadow-[0_0_10px_rgba(201,168,76,0.2)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(0,0,0,0.8))",
                    color: "var(--accent-gold)",
                    border: "1px solid rgba(201,168,76,0.4)",
                  }}
                >
                  {p.firstName[0].toUpperCase()}
                </div>
                {/* Online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border border-black shadow-[0_0_8px_#22c55e]" />
              </div>

              <div className="flex flex-col">
                <span
                  className="text-sm font-medium leading-none group-hover:text-[var(--accent-gold)] transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {p.firstName} {p.lastName || ""}
                </span>
                {index ===
                  0 /* Assuming index 0 is creator or showing a fun title */ && (
                  <span className="text-[10px] font-lora italic mt-1 text-purple-400 opacity-80 flex items-center gap-1">
                    <Crown size={10} /> Grand Scribe
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
