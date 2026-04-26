"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const slides = [
  {
    src: "/paintings/tarama1.png",
    title: "Fırtınanın Eşiğinde",
    subtitle: "Yağlı Boya · Tuval Üzeri",
    year: "2025",
  },
  {
    src: "/paintings/tarama2.png",
    title: "Akdeniz Dalgası",
    subtitle: "Yağlı Boya · Tuval Üzeri",
    year: "2025",
  },
  {
    src: "/paintings/tarama3.png",
    title: "Gece Koyu",
    subtitle: "Yağlı Boya · Tuval Üzeri",
    year: "2025",
  },
  {
    src: "/paintings/tarama4.png",
    title: "Altın Alacakaranlık",
    subtitle: "Yağlı Boya · Tuval Üzeri",
    year: "2026",
  },
];

const INTERVAL = 5000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressKey = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      if (transitioning || index === current) return;
      setTransitioning(true);
      setPrev(current);
      setCurrent(index);
      progressKey.current += 1;
      setTimeout(() => {
        setPrev(null);
        setTransitioning(false);
      }, 1200);
    },
    [current, transitioning]
  );

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const back = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [next, paused, current]);

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100svh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 ${
            i === current
              ? "hero-slide-in z-10"
              : i === prev
              ? "hero-slide-out z-10"
              : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            priority={i === 0}
            quality={100}
            sizes="100vw"
            className="object-contain md:object-cover object-center"
            style={{ objectPosition: "center 40%" }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.1) 40%, rgba(10,10,10,0.1) 100%)",
            }}
          />
        </div>
      ))}

      {/* Slide info */}
      <div className="absolute bottom-24 left-8 lg:left-16 z-20 fade-up" key={current}>
        <p
          className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] mb-2 opacity-90"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          {slides[current].subtitle} · {slides[current].year}
        </p>
        <h1
          className="text-5xl lg:text-7xl font-light leading-[1.1] tracking-wide text-white mb-6"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          {slides[current].title}
        </h1>
        <a
          href="#collection"
          className="inline-flex items-center gap-3 px-7 py-3 text-xs tracking-[0.25em] uppercase border transition-all duration-400 hover:bg-[#c9a96e] hover:border-[#c9a96e] hover:text-black"
          style={{ borderColor: "rgba(201,169,110,0.6)", color: "#e8d5a3" }}
        >
          Koleksiyonu Keşfet
        </a>
      </div>

      {/* Arrows */}
      <button
        onClick={back}
        aria-label="Önceki"
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-[#c9a96e] hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#c9a96e]/40 backdrop-blur-sm"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Sonraki"
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-[#c9a96e] hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#c9a96e]/40 backdrop-blur-sm"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Dots + progress */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slayt ${i + 1}`}
            className="relative h-[2px] transition-all duration-500 overflow-hidden rounded-full"
            style={{
              width: i === current ? 40 : 16,
              background: i === current ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.25)",
            }}
          >
            {i === current && (
              <span
                key={progressKey.current}
                className="progress-bar absolute inset-y-0 left-0 bg-[#c9a96e]"
                style={{ animationDuration: `${INTERVAL}ms` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-10 right-8 lg:right-16 z-20 text-xs tracking-[0.2em] text-white/40">
        <span className="text-[#c9a96e]">{String(current + 1).padStart(2, "0")}</span>
        <span className="mx-1">/</span>
        {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
