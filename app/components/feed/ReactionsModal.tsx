"use client";

import { IconX } from "../icons";
import type { Reaction } from "@/lib/types";

const REACTION_LABELS: Record<string, string> = {
  LIKE: "Like",
  LOVE: "Love",
  HAHA: "Haha",
  WOW: "Wow",
  SAD: "Sad",
  ANGRY: "Angry",
};

const REACTION_EMOJIS: Record<string, string> = {
  LIKE: "\u{1F44D}",
  LOVE: "\u2764\uFE0F",
  HAHA: "\u{1F604}",
  WOW: "\u{1F62E}",
  SAD: "\u{1F622}",
  ANGRY: "\u{1F621}",
};

export default function ReactionsModal({
  reactions,
  onClose,
}: {
  reactions: Reaction[];
  onClose: () => void;
}) {
  const grouped = reactions.reduce<Record<string, typeof reactions>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const types = Object.keys(grouped).sort((a, b) => grouped[b].length - grouped[a].length);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 12, padding: 20,
          maxWidth: 400, width: "90%", maxHeight: "80vh", overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Reactions</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <IconX size={20} />
          </button>
        </div>
        {types.map((type) => (
          <div key={type} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{REACTION_EMOJIS[type]}</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#666" }}>
                {REACTION_LABELS[type]} ({grouped[type].length})
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {grouped[type].map((r) => (
                <div key={r.id || `${r.type}-${r.userId}`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    src={r.user?.avatar || "/images/react_img.png"}
                    alt=""
                    style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <span style={{ fontSize: 14 }}>{r.user?.name || "Unknown"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {reactions.length === 0 && (
          <p style={{ textAlign: "center", color: "#999", margin: "20px 0" }}>No reactions yet</p>
        )}
      </div>
    </div>
  );
}
