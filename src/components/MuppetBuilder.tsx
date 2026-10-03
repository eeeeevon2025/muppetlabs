"use client";

import { useCallback, useId, useMemo, useRef, useState, type SVGProps } from "react";
import { Button } from "@/components/ui";

type PartKind =
  | "head-green"
  | "head-pink"
  | "head-orange"
  | "body-green"
  | "body-pink"
  | "eye"
  | "eye-big"
  | "nose-round"
  | "nose-button"
  | "nose-snout"
  | "nose-cone"
  | "nose-bulb"
  | "nose-flat"
  | "mouth-smile"
  | "mouth-open"
  | "hair-fuzz"
  | "bow"
  | "hat"
  | "arm";

type PartTemplate = {
  kind: PartKind;
  label: string;
  w: number;
  h: number;
};

const PARTS: PartTemplate[] = [
  { kind: "head-green", label: "Green head", w: 120, h: 110 },
  { kind: "head-pink", label: "Pink head", w: 120, h: 110 },
  { kind: "head-orange", label: "Orange head", w: 115, h: 105 },
  { kind: "body-green", label: "Green body", w: 100, h: 90 },
  { kind: "body-pink", label: "Pink body", w: 100, h: 90 },
  { kind: "eye", label: "Eye", w: 36, h: 36 },
  { kind: "eye-big", label: "Big eye", w: 48, h: 48 },
  { kind: "nose-round", label: "Round nose", w: 28, h: 24 },
  { kind: "nose-button", label: "Button nose", w: 22, h: 22 },
  { kind: "nose-snout", label: "Snout", w: 44, h: 32 },
  { kind: "nose-cone", label: "Cone nose", w: 32, h: 40 },
  { kind: "nose-bulb", label: "Bulb nose", w: 36, h: 36 },
  { kind: "nose-flat", label: "Flat nose", w: 48, h: 20 },
  { kind: "mouth-smile", label: "Smile", w: 56, h: 28 },
  { kind: "mouth-open", label: "Open mouth", w: 52, h: 36 },
  { kind: "hair-fuzz", label: "Fuzzy top", w: 90, h: 48 },
  { kind: "bow", label: "Bow", w: 64, h: 40 },
  { kind: "hat", label: "Top hat", w: 72, h: 56 },
  { kind: "arm", label: "Arm", w: 72, h: 36 },
];

type PlacedPart = {
  id: string;
  kind: PartKind;
  x: number;
  y: number;
  z: number;
};

function PartSvg({ kind, className = "", style, ...props }: { kind: PartKind } & SVGProps<SVGSVGElement>) {
  const svgClass = `h-full w-full ${className}`.trim();
  const svgStyle = { pointerEvents: "visiblePainted" as const, ...style };
  switch (kind) {
    case "head-green":
      return (
        <svg viewBox="0 0 120 110" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="60" cy="58" rx="52" ry="48" fill="#4ADE80" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case "head-pink":
      return (
        <svg viewBox="0 0 120 110" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="60" cy="58" rx="52" ry="48" fill="#FF2264" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case "head-orange":
      return (
        <svg viewBox="0 0 115 105" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="57" cy="55" rx="48" ry="44" fill="#FB923C" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case "body-green":
      return (
        <svg viewBox="0 0 100 90" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="50" cy="48" rx="42" ry="38" fill="#4ADE80" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case "body-pink":
      return (
        <svg viewBox="0 0 100 90" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="50" cy="48" rx="42" ry="38" fill="#FF2264" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 36 36" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <circle cx="18" cy="18" r="16" fill="#fff" stroke="#000" strokeWidth="3" />
          <circle cx="20" cy="16" r="7" fill="#000" />
          <circle cx="22" cy="14" r="2.5" fill="#fff" />
        </svg>
      );
    case "eye-big":
      return (
        <svg viewBox="0 0 48 48" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <circle cx="24" cy="24" r="22" fill="#fff" stroke="#000" strokeWidth="3" />
          <circle cx="26" cy="22" r="10" fill="#000" />
          <circle cx="29" cy="19" r="3.5" fill="#fff" />
        </svg>
      );
    case "nose-round":
      return (
        <svg viewBox="0 0 28 24" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="14" cy="12" rx="11" ry="9" fill="#FB923C" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case "nose-button":
      return (
        <svg viewBox="0 0 22 22" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <circle cx="11" cy="11" r="8" fill="#4ADE80" stroke="#000" strokeWidth="3" />
          <ellipse cx="13" cy="9" rx="2" ry="1.5" fill="#86EFAC" opacity="0.8" />
        </svg>
      );
    case "nose-snout":
      return (
        <svg viewBox="0 0 44 32" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="22" cy="16" rx="18" ry="12" fill="#FF2264" stroke="#000" strokeWidth="3" />
          <ellipse cx="14" cy="18" rx="3" ry="4" fill="#000" />
          <ellipse cx="30" cy="18" rx="3" ry="4" fill="#000" />
        </svg>
      );
    case "nose-cone":
      return (
        <svg viewBox="0 0 32 40" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <polygon points="16,4 28,36 4,36" fill="#FB923C" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="16" cy="34" rx="6" ry="3" fill="#FDBA74" stroke="#000" strokeWidth="2" />
        </svg>
      );
    case "nose-bulb":
      return (
        <svg viewBox="0 0 36 36" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <circle cx="18" cy="18" r="14" fill="#F472B6" stroke="#000" strokeWidth="3" />
          <ellipse cx="22" cy="14" rx="4" ry="3" fill="#FBCFE8" />
        </svg>
      );
    case "nose-flat":
      return (
        <svg viewBox="0 0 48 20" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <rect x="4" y="4" width="40" height="12" rx="6" fill="#A16207" stroke="#000" strokeWidth="3" />
          <ellipse cx="16" cy="10" rx="2.5" ry="2" fill="#000" />
          <ellipse cx="32" cy="10" rx="2.5" ry="2" fill="#000" />
        </svg>
      );
    case "mouth-smile":
      return (
        <svg viewBox="0 0 56 28" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <path
            d="M6 8 Q28 28 50 8"
            fill="none"
            stroke="#000"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "mouth-open":
      return (
        <svg viewBox="0 0 52 36" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="26" cy="20" rx="20" ry="14" fill="#000" stroke="#000" strokeWidth="3" />
          <ellipse cx="26" cy="16" rx="14" ry="6" fill="#FF2264" />
        </svg>
      );
    case "hair-fuzz":
      return (
        <svg viewBox="0 0 90 48" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <path
            d="M8 40 Q12 8 24 20 Q36 0 45 18 Q54 2 66 22 Q78 6 82 38 Z"
            fill="#7C3AED"
            stroke="#000"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bow":
      return (
        <svg viewBox="0 0 64 40" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <path d="M32 20 L8 4 L8 36 Z" fill="#FF2264" stroke="#000" strokeWidth="3" />
          <path d="M32 20 L56 4 L56 36 Z" fill="#FF2264" stroke="#000" strokeWidth="3" />
          <circle cx="32" cy="20" r="8" fill="#FF2264" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case "hat":
      return (
        <svg viewBox="0 0 72 56" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <rect x="10" y="28" width="52" height="22" fill="#000" stroke="#000" strokeWidth="3" />
          <rect x="22" y="6" width="28" height="26" fill="#000" stroke="#000" strokeWidth="3" />
          <rect x="4" y="44" width="64" height="8" fill="#000" stroke="#000" strokeWidth="3" />
        </svg>
      );
    case "arm":
      return (
        <svg viewBox="0 0 72 36" className={svgClass} style={svgStyle} aria-hidden {...props}>
          <ellipse cx="36" cy="18" rx="32" ry="14" fill="#4ADE80" stroke="#000" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
}

function partSize(kind: PartKind) {
  return PARTS.find((p) => p.kind === kind) ?? { w: 48, h: 48 };
}

let zCounter = 1;

export default function MuppetBuilder() {
  const stageId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<PlacedPart[]>([]);
  const [dragging, setDragging] = useState<
    | { mode: "palette"; kind: PartKind; offsetX: number; offsetY: number }
    | { mode: "stage"; id: string; offsetX: number; offsetY: number }
    | null
  >(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

  const sortedPlaced = useMemo(
    () => [...placed].sort((a, b) => a.z - b.z),
    [placed],
  );

  const addPart = useCallback((kind: PartKind, clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const { w, h } = partSize(kind);
    const x = Math.max(0, Math.min(rect.width - w, clientX - rect.left - w / 2));
    const y = Math.max(0, Math.min(rect.height - h, clientY - rect.top - h / 2));
    zCounter += 1;
    setPlaced((prev) => [
      ...prev,
      { id: `${kind}-${Date.now()}`, kind, x, y, z: zCounter },
    ]);
  }, []);

  const movePart = useCallback((id: string, clientX: number, clientY: number, offsetX: number, offsetY: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    setPlaced((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const { w, h } = partSize(p.kind);
        const x = Math.max(0, Math.min(rect.width - w, clientX - rect.left - offsetX));
        const y = Math.max(0, Math.min(rect.height - h, clientY - rect.top - offsetY));
        return { ...p, x, y };
      }),
    );
  }, []);

  const bringToFront = useCallback((id: string) => {
    zCounter += 1;
    setPlaced((prev) => {
      const part = prev.find((p) => p.id === id);
      if (!part) return prev;
      const rest = prev.filter((p) => p.id !== id);
      return [...rest, { ...part, z: zCounter }];
    });
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      if (dragging.mode === "stage") {
        movePart(dragging.id, e.clientX, e.clientY, dragging.offsetX, dragging.offsetY);
      } else {
        setGhostPos({ x: e.clientX, y: e.clientY });
      }
    },
    [dragging, movePart],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      if (dragging.mode === "palette") {
        const stage = stageRef.current;
        if (stage) {
          const rect = stage.getBoundingClientRect();
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
          if (inside) addPart(dragging.kind, e.clientX, e.clientY);
        }
      } else {
        bringToFront(dragging.id);
      }
      setDragging(null);
      setGhostPos(null);
    },
    [dragging, addPart, bringToFront],
  );

  return (
    <section
      className="border-y-[3px] border-foreground bg-surface-alt"
      aria-labelledby={`${stageId}-title`}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-foreground pb-4">
          <div>
            <h2 id={`${stageId}-title`} className="font-display text-2xl font-normal">
              Build a Muppet
            </h2>
            <p className="mt-1 max-w-xl text-text-secondary">
              Drag fuzzy parts onto the stage. Stack eyes, mouths, and chaos until it feels
              backstage-ready.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="text-xs"
            onClick={() => setPlaced([])}
            disabled={placed.length === 0}
          >
            Clear stage
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr]">
          <div
            className="border-[3px] border-foreground bg-surface p-4 brutal-shadow-sm"
            aria-label="Muppet parts palette"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-text-secondary">
              Parts
            </p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              {PARTS.map((part) => (
                <li key={part.kind}>
                  <button
                    type="button"
                    className="flex w-full cursor-grab flex-col items-center gap-1 border-[3px] border-foreground bg-white p-2 text-center transition hover:bg-primary/20 active:cursor-grabbing"
                    aria-label={`Drag ${part.label} onto stage`}
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setGhostPos({ x: e.clientX, y: e.clientY });
                      setDragging({
                        mode: "palette",
                        kind: part.kind,
                        offsetX: part.w / 2,
                        offsetY: part.h / 2,
                      });
                    }}
                    onDoubleClick={() => {
                      const stage = stageRef.current;
                      if (!stage) return;
                      const rect = stage.getBoundingClientRect();
                      addPart(part.kind, rect.left + rect.width / 2, rect.top + rect.height / 2);
                    }}
                  >
                    <span
                      className="pointer-events-none block"
                      style={{ width: Math.min(part.w, 72), height: Math.min(part.h, 56) }}
                    >
                      <PartSvg kind={part.kind} />
                    </span>
                    <span className="pointer-events-none text-[10px] font-bold uppercase leading-tight">
                      {part.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-text-secondary">
              Drag onto the stage or double-click a part. Stack freely — click a piece to bring it forward.
            </p>
          </div>

          <div
            ref={stageRef}
            className="relative min-h-[320px] border-[3px] border-foreground bg-white brutal-shadow sm:min-h-[420px]"
            role="application"
            aria-label="Muppet building stage"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #000 0, #000 1px, transparent 1px, transparent 24px)",
              }}
              aria-hidden
            />
            {placed.length === 0 && (
              <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold uppercase tracking-wide text-text-secondary">
                Drop parts here
              </p>
            )}
            {sortedPlaced.map((part) => {
              const { w, h } = partSize(part.kind);
              const isDragging = dragging?.mode === "stage" && dragging.id === part.id;
              return (
                <div
                  key={part.id}
                  className="absolute touch-none pointer-events-none"
                  style={{
                    left: part.x,
                    top: part.y,
                    width: w,
                    height: h,
                    zIndex: isDragging ? part.z + 1000 : part.z,
                  }}
                >
                  <PartSvg
                    kind={part.kind}
                    className={`cursor-grab touch-none active:cursor-grabbing ${isDragging ? "opacity-90" : ""}`}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      bringToFront(part.id);
                      e.currentTarget.setPointerCapture(e.pointerId);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setDragging({
                        mode: "stage",
                        id: part.id,
                        offsetX: e.clientX - rect.left,
                        offsetY: e.clientY - rect.top,
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {dragging?.mode === "palette" && ghostPos && (
        <div
          className="pointer-events-none fixed z-[9999] touch-none opacity-80"
          style={{
            left: ghostPos.x - dragging.offsetX,
            top: ghostPos.y - dragging.offsetY,
            width: partSize(dragging.kind).w,
            height: partSize(dragging.kind).h,
          }}
          aria-hidden
        >
          <PartSvg kind={dragging.kind} />
        </div>
      )}
    </section>
  );
}
