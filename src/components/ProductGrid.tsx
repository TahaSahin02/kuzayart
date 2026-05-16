"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { useCart, ItemType } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Painting {
  id: number;
  src: string;
  title: string;
  medium: string;
  dimensions: string;
  year: string;
  price: number;
  print_price: number;
  is_sold: boolean;
  show_in_hero: boolean;
  hero_order: number;
}

const ZoomModal = dynamic(() => import("./ZoomModal"), { ssr: false });

/* ── Single product card ── */
function ProductCard({ painting }: { painting: Painting }) {
  const { addItem, removeItem, hasItem } = useCart();
  const { t } = useLang();
  const { format } = useCurrency();

  const [zoomed, setZoomed]     = useState(false);
  const [liked, setLiked]       = useState(false);
  const [selected, setSelected] = useState<ItemType>(painting.is_sold ? "print" : "original");

  // The ONLY source of truth: admin-set is_sold flag
  const isSold     = painting.is_sold;
  const activePrice = selected === "original" ? painting.price : painting.print_price;
  const inCart      = hasItem(painting.id, selected);

  // If admin marks original as sold while user has it selected, auto-switch to print
  useEffect(() => {
    if (isSold && selected === "original") setSelected("print");
  }, [isSold, selected]);

  const handleCartToggle = () => {
    if (inCart) {
      removeItem(painting.id, selected);
    } else {
      addItem({
        id: painting.id,
        type: selected,
        title: painting.title,
        price: activePrice,
        src: painting.src,
        medium: painting.medium,
        dimensions: painting.dimensions,
      });
    }
  };

  return (
    <>
      <article
        className="product-card group relative flex flex-col rounded-sm overflow-hidden"
        style={{ background: "#c8c0b0", border: "1px solid rgba(0,0,0,0.1)" }}
      >
        {/* Image */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <Image
            src={painting.src}
            alt={painting.title}
            fill
            quality={100}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized={painting.src.startsWith("http")}
          />

          {/* Hover overlay (zoom) */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(0,0,0,0.45)" }}
          >
            <button
              onClick={() => setZoomed(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              {t("product.zoom")}
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={() => setLiked((v) => !v)}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
            style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.1)" }}
            aria-label="Favorilere ekle"
          >
            {liked ? (
              <HeartSolid className="w-4 h-4 text-rose-400" />
            ) : (
              <HeartIcon className="w-4 h-4 text-white/50" />
            )}
          </button>

          {/* Full overlay when original is sold AND selected */}
          {isSold && selected === "original" && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <span className="px-6 py-2 text-xs tracking-[0.35em] uppercase font-medium text-white border border-white/30">
                {t("product.sold")}
              </span>
            </div>
          )}

          {/* Small persistent badge — original sold but viewing print */}
          {isSold && selected !== "original" && (
            <div className="absolute top-3 left-3">
              <span
                className="px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase"
                style={{
                  background: "rgba(0,0,0,0.72)",
                  color: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {t("product.originalSold")}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3 p-6">
          <h3
            className="text-2xl font-light leading-snug text-black"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {painting.title}
          </h3>

          <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-black/35">
            <span>{painting.medium === "Yağlı Boya" ? t("painting.medium") : painting.medium}</span>
            <span className="w-1 h-1 rounded-full bg-black/20" />
            <span>{painting.dimensions}</span>
            <span className="w-1 h-1 rounded-full bg-black/20" />
            <span>{painting.year}</span>
          </div>

          {/* Original / Print toggle */}
          <div
            className="mt-1 flex gap-0"
            style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "14px" }}
          >
            {(["original", "print"] as ItemType[]).map((type) => {
              const active   = selected === type;
              const disabled = type === "original" && isSold;
              return (
                <button
                  key={type}
                  onClick={() => !disabled && setSelected(type)}
                  disabled={disabled}
                  className="flex-1 py-2 text-[11px] tracking-[0.18em] uppercase transition-all duration-200"
                  style={{
                    background: active ? "rgba(0,0,0,0.08)" : "transparent",
                    border: "1px solid",
                    borderColor: active ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.12)",
                    color: disabled
                      ? "rgba(0,0,0,0.2)"
                      : active
                      ? "rgba(0,0,0,0.85)"
                      : "rgba(0,0,0,0.4)",
                    marginRight: type === "original" ? "-1px" : "0",
                    position: "relative",
                    zIndex: active ? 1 : 0,
                    fontWeight: active ? 500 : 400,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  {type === "original" ? t("product.original") : t("product.print")}
                  {type === "original" && isSold && <span className="ml-1 text-[9px]">✕</span>}
                </button>
              );
            })}
          </div>

          {/* Note */}
          <p className="text-[10px] tracking-[0.12em]" style={{ color: "rgba(0,0,0,0.35)" }}>
            {selected === "original" ? t("product.originalNote") : t("product.printNote")}
          </p>

          {/* Price + cart */}
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-black/35 mb-1">
                {t("product.price")}
              </p>
              <p
                className="font-light text-black transition-all duration-200"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.75rem" }}
              >
                {format(activePrice)}
              </p>
            </div>

            {!(selected === "original" && isSold) && (
              <button
                onClick={handleCartToggle}
                className="flex items-center gap-2 px-5 py-3 text-xs tracking-[0.15em] uppercase transition-all duration-300 active:scale-95 rounded-sm"
                style={{
                  background: inCart ? "rgba(0,0,0,0.12)" : "transparent",
                  border: inCart ? "1px solid rgba(0,0,0,0.4)" : "1px solid rgba(0,0,0,0.2)",
                  color: inCart ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.65)",
                }}
              >
                <ShoppingCartIcon className="w-4 h-4" />
                {inCart ? t("product.inCart") : t("product.addToCart")}
              </button>
            )}
          </div>
        </div>
      </article>

      {zoomed && (
        <ZoomModal src={painting.src} title={painting.title} onClose={() => setZoomed(false)} />
      )}
    </>
  );
}

/* ── Grid ── */
export default function ProductGrid() {
  const { t } = useLang();
  const [paintings, setPaintings] = useState<Painting[]>([]);

  const loadPaintings = () => {
    // cache-buster + no-store so admin changes show immediately
    fetch(`/api/paintings?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Painting[]) => setPaintings(data))
      .catch(() => {});
  };

  useEffect(() => {
    loadPaintings();
    // Refresh whenever the tab regains focus — picks up admin changes instantly
    const onFocus = () => loadPaintings();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return (
    <section id="collection" style={{ paddingTop: "96px", paddingBottom: "200px" }}>
      <div
        style={{
          maxWidth: "1400px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-white/35 mb-3">
              {t("collection.subtitle")}
            </p>
            <h2
              className="text-5xl lg:text-6xl font-light text-white leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {t("collection.title")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paintings.map((painting) => (
            <ProductCard key={painting.id} painting={painting} />
          ))}
        </div>
      </div>
    </section>
  );
}
