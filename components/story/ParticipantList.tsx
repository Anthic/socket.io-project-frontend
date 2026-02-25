
"use client";

import { Users } from "lucide-react";
import { Participant } from "../../store/roomStore";

type Props = { participants: Participant[] };

export default function ParticipantList({ participants }: Props) {
  return (
    <div className="rounded-xl p-4 border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>

      <div className="flex items-center gap-2 mb-4">
        <Users size={14} style={{ color: "var(--accent-gold)" }} />
        <span className="text-xs font-cinzel tracking-wider" style={{ color: "var(--accent-gold)" }}>
          WRITERS ({participants.length})
        </span>
      </div>

      <div className="space-y-2">
        {participants.map((p) => (
          <div key={p.id} className="flex items-center gap-3 py-1">
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--bg-elevated)", color: "var(--accent-gold)", border: "1px solid var(--border-gold)" }}>
                {p.firstName[0].toUpperCase()}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2"
                style={{ borderColor: "var(--bg-card)" }} />
            </div>

            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {p.firstName} {p.lastName || ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}