// shopeee · Warehouse Zinc — 線画アイコンセット
// stroke-based, 1.75px, no emoji, no fill. Drop-in replacement for Icons.{name}.
// Usage in App.jsx:
//   import { Icons } from './warehouse-icons';
// (the object signature mirrors the existing Icons map in App.jsx)

import React from "react";

const Icon = ({ d, size = 20, className = "", color = "currentColor" }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke={color} strokeWidth="1.75"
    strokeLinecap="square" strokeLinejoin="miter"
    className={className}
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

// ── Product / Material glyphs ────────────────────────────────────────────
// Replaces emoji 🔧 🔩 ⚙️ 📦 ⭕ in the existing data model.
// Mapped by category, not by product — cleaner and less maintenance.

export const CategoryIcon = ({ category, size = 48, color = "currentColor" }) => {
  const s = size, cx = 12, cy = 12;
  const stroke = { fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "square" };

  switch (category) {
    case "配管材":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <rect x="2" y="9" width="20" height="6"/>
          <line x1="5"  y1="9" x2="5"  y2="15"/>
          <line x1="8"  y1="9" x2="8"  y2="15"/>
          <line x1="11" y1="9" x2="11" y2="15"/>
          <line x1="14" y1="9" x2="14" y2="15"/>
          <line x1="17" y1="9" x2="17" y2="15"/>
        </svg>
      );
    case "バルブ":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <circle cx={cx} cy={cy} r="5"/>
          <line x1="2" y1="12" x2="7"  y2="12"/>
          <line x1="17" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="3" x2="12" y2="7"/>
          <line x1="9"  y1="3" x2="15" y2="3"/>
        </svg>
      );
    case "ポンプ":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <circle cx={cx} cy="13" r="6"/>
          <circle cx={cx} cy="13" r="2"/>
          <rect x="10" y="2" width="4" height="4"/>
          <line x1="12" y1="6" x2="12" y2="7"/>
        </svg>
      );
    case "保温材":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <rect x="3" y="5" width="18" height="14"/>
          <line x1="3" y1="9"  x2="21" y2="9"/>
          <line x1="3" y1="13" x2="21" y2="13"/>
          <line x1="3" y1="17" x2="21" y2="17"/>
        </svg>
      );
    case "フランジ":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <circle cx={cx} cy={cy} r="9"/>
          <circle cx={cx} cy={cy} r="4"/>
          <circle cx="12" cy="5"  r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="12" cy="19" r="1"/>
          <circle cx="5"  cy="12" r="1"/>
        </svg>
      );
    case "ガスケット":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <circle cx={cx} cy={cy} r="9"/>
          <circle cx={cx} cy={cy} r="5" strokeDasharray="2 2"/>
        </svg>
      );
    case "締結材":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <polygon points="7,3 17,3 20,8 17,13 7,13 4,8"/>
          <line x1="12" y1="13" x2="12" y2="21"/>
          <line x1="10" y1="16" x2="14" y2="16"/>
          <line x1="10" y1="19" x2="14" y2="19"/>
        </svg>
      );
    case "継手":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <path d="M 3 9 L 9 9 L 9 3 L 15 3 L 15 9 L 21 9 L 21 15 L 15 15 L 15 21 L 9 21 L 9 15 L 3 15 Z"/>
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}>
          <rect x="4" y="4" width="16" height="16"/>
          <line x1="4" y1="4" x2="20" y2="20"/>
        </svg>
      );
  }
};

// ── App-level Icons map — drop-in replacement for Icons.{name} in App.jsx ──

export const Icons = {
  home:       (p) => <Icon {...p} d={["M3 10 L12 3 L21 10 L21 21 L3 21 Z", "M9 21 L9 13 L15 13 L15 21"]}/>,
  package:    (p) => <Icon {...p} d={["M3 7 L12 3 L21 7 L21 17 L12 21 L3 17 Z", "M3 7 L12 11 L21 7", "M12 11 L12 21"]}/>,
  orders:     (p) => <Icon {...p} d={["M6 3 L14 3 L20 9 L20 21 L6 21 Z", "M14 3 L14 9 L20 9", "M9 13 L17 13", "M9 17 L17 17"]}/>,
  users:      (p) => <Icon {...p} d={["M4 21 V18 A4 4 0 0 1 8 14 H12 A4 4 0 0 1 16 18 V21", "M10 10 A3 3 0 1 0 10 4 A3 3 0 0 0 10 10", "M18 21 V19 A3 3 0 0 0 16 16.2"]}/>,
  chart:      (p) => <Icon {...p} d={["M3 3 L3 21 L21 21", "M7 17 L7 13", "M12 17 L12 8", "M17 17 L17 11"]}/>,
  cart:       (p) => <Icon {...p} d={["M2 3 L5 3 L7 15 L19 15 L21 7 L7 7", "M9 20 A1 1 0 1 0 9 18 A1 1 0 0 0 9 20", "M17 20 A1 1 0 1 0 17 18 A1 1 0 0 0 17 20"]}/>,
  brain:      (p) => <Icon {...p} d={["M9 4 A3 3 0 0 0 6 7 A3 3 0 0 0 5 13 A3 3 0 0 0 6 19 A3 3 0 0 0 12 20 V4 A3 3 0 0 0 9 4 Z", "M15 4 A3 3 0 0 1 18 7 A3 3 0 0 1 19 13 A3 3 0 0 1 18 19 A3 3 0 0 1 12 20"]}/>,
  search:     (p) => <Icon {...p} d={["M11 19 A8 8 0 1 0 11 3 A8 8 0 0 0 11 19 Z", "M17 17 L21 21"]}/>,
  send:       (p) => <Icon {...p} d={["M21 3 L3 10 L10 13 L13 20 L21 3 Z", "M10 13 L21 3"]}/>,
  x:          (p) => <Icon {...p} d={["M5 5 L19 19", "M19 5 L5 19"]}/>,
  menu:       (p) => <Icon {...p} d={["M4 7 L20 7", "M4 12 L20 12", "M4 17 L20 17"]}/>,
  chevronRight: (p) => <Icon {...p} d="M9 5 L16 12 L9 19"/>,
  chevronDown:  (p) => <Icon {...p} d="M5 9 L12 16 L19 9"/>,
  dollar:     (p) => <Icon {...p} d={["M12 2 V22", "M17 6 H9 A3 3 0 0 0 9 12 H15 A3 3 0 0 1 15 18 H7"]}/>,
  truck:      (p) => <Icon {...p} d={["M2 5 L16 5 L16 16 L2 16 Z", "M16 9 L20 9 L22 12 L22 16 L16 16", "M6 19 A2 2 0 1 0 6 15 A2 2 0 0 0 6 19 Z", "M18 19 A2 2 0 1 0 18 15 A2 2 0 0 0 18 19 Z"]}/>,
  settings:   (p) => <Icon {...p} d={["M12 15 A3 3 0 1 0 12 9 A3 3 0 0 0 12 15 Z", "M12 2 L12 5", "M12 19 L12 22", "M2 12 L5 12", "M19 12 L22 12", "M5 5 L7 7", "M17 17 L19 19", "M5 19 L7 17", "M17 7 L19 5"]}/>,
  minus:      (p) => <Icon {...p} d="M5 12 L19 12"/>,
  plus:       (p) => <Icon {...p} d={["M5 12 L19 12", "M12 5 L12 19"]}/>,
  trash:      (p) => <Icon {...p} d={["M3 6 L21 6", "M8 6 L8 4 L16 4 L16 6", "M5 6 L6 21 L18 21 L19 6"]}/>,
  check:      (p) => <Icon {...p} d="M4 12 L10 18 L20 6"/>,
  arrowLeft:  (p) => <Icon {...p} d={["M20 12 L4 12", "M10 6 L4 12 L10 18"]}/>,
  star:       (p) => <Icon {...p} d="M12 3 L14.5 9 L21 9.5 L16 14 L17.5 21 L12 17.5 L6.5 21 L8 14 L3 9.5 L9.5 9 Z"/>,
  inventory:  (p) => <Icon {...p} d={["M3 7 L12 3 L21 7 L21 17 L12 21 L3 17 Z", "M3 7 L12 11 L21 7", "M12 11 L12 21"]}/>,
  bell:       (p) => <Icon {...p} d={["M6 8 A6 6 0 0 1 18 8 V14 L20 17 L4 17 L6 14 Z", "M10 20 L14 20"]}/>,
  store:      (p) => <Icon {...p} d={["M3 9 L5 3 L19 3 L21 9", "M3 9 L21 9 L21 21 L3 21 Z", "M9 21 L9 13 L15 13 L15 21"]}/>,
  // warehouse-specific additions
  barcode:    (p) => <Icon {...p} d={["M4 5 L4 19", "M6 5 L6 19", "M9 5 L9 19", "M11 5 L11 19", "M13 5 L13 19", "M16 5 L16 19", "M18 5 L18 19", "M20 5 L20 19"]}/>,
  bay:        (p) => <Icon {...p} d={["M3 7 L21 7 L21 17 L3 17 Z", "M8 7 L8 17", "M13 7 L13 17", "M18 7 L18 17"]}/>,
  scan:       (p) => <Icon {...p} d={["M3 7 L3 4 L7 4", "M17 4 L21 4 L21 7", "M21 17 L21 20 L17 20", "M7 20 L3 20 L3 17", "M3 12 L21 12"]}/>,
};

export default Icons;
