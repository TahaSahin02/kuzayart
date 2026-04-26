"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import Image from "next/image";
import { XMarkIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from "@heroicons/react/24/outline";

interface ZoomModalProps {
  src: string;
  title: string;
  onClose: () => void;
}

export default function ZoomModal({ src, title, onClose }: ZoomModalProps) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (scale !== 1) return;
    onClose();
  }, [onClose, scale]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.5, 4));
      if (e.key === "-") setScale((s) => Math.max(s - 0.5, 1));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((s) => Math.min(Math.max(s - e.deltaY * 0.002, 1), 5));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({
      x: dragStart.current.px + (e.clientX - dragStart.current.x),
      y: dragStart.current.py + (e.clientY - dragStart.current.y),
    });
  };
  const onMouseUp = () => setDragging(false);

  const resetZoom = () => { setScale(1); setPos({ x: 0, y: 0 }); };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-content relative flex flex-col w-full h-full max-w-[96vw] max-h-[96vh] mx-auto my-auto"
        style={{ userSelect: "none" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <p
            className="text-sm tracking-[0.2em] uppercase text-[#c9a96e]"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem" }}
          >
            {title}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(s - 0.5, 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Uzaklaştır"
            >
              <MagnifyingGlassMinusIcon className="w-5 h-5" />
            </button>
            <span className="text-xs text-white/40 w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(s + 0.5, 5))}
              className="w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Yakınlaştır"
            >
              <MagnifyingGlassPlusIcon className="w-5 h-5" />
            </button>
            {scale !== 1 && (
              <button
                onClick={resetZoom}
                className="text-xs tracking-wider text-white/40 hover:text-white/70 transition-colors px-2"
              >
                Sıfırla
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-2 w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Kapat"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image container */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-hidden"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
        >
          <div
            className="w-full h-full transition-transform duration-[50ms]"
            style={{
              transform: `scale(${scale}) translate(${pos.x / scale}px, ${pos.y / scale}px)`,
              transformOrigin: "center center",
            }}
          >
            <Image
              src={src}
              alt={title}
              fill
              quality={100}
              sizes="96vw"
              className="object-contain"
              draggable={false}
            />
          </div>
        </div>

        <p className="text-center text-xs text-white/25 py-3 tracking-widest">
          Yakınlaştırmak için kaydırın veya +/− tuşlarını kullanın · ESC ile kapatın
        </p>
      </div>
    </div>
  );
}
