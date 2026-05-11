"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { paintings } from "@/lib/paintings";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

const ZoomModal = dynamic(() => import("./ZoomModal"), { ssr: false });

function ProductCard({
  painting,
  soldIds,
}: {
  painting: (typeof paintings)[0];
  soldIds: Set<number>;
}) {
  const { addItem, removeItem, hasItem } = useCart();
  const { t } = useLang();
  const { format } = useCurrency();
  const [zoomed, setZoomed] = useState(false);
  const [liked, setLiked] = useState(false);

  const isSold = soldIds.has(painting.id);
  const inCart = hasItem(painting.id);

  const handleCartToggle = () => {
    if (inCart) {
      removeItem(painting.id);
    } else {
      addItem({
        id: painting.id,
        title: painting.title,
        price: painting.price,
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
          />

          {/* Hover overlay */}
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

          {/* Sold badge */}
          {isSold && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <span className="px-6 py-2 text-xs tracking-[0.35em] uppercase font-medium text-white border border-white/30">
                {t("product.sold")}
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
            <span>{painting.medium}</span>
            <span className="w-1 h-1 rounded-full bg-black/20" />
            <span>{painting.dimensions}</span>
            <span className="w-1 h-1 rounded-full bg-black/20" />
            <span>{painting.year}</span>
          </div>

          <div
            className="mt-2 pt-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}
          >
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-black/35 mb-1">{t("product.price")}</p>
              <p
                className="text-3xl font-light text-black"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {format(painting.price)}
              </p>
            </div>

            {!isSold && (
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
        <ZoomModal
          src={painting.src}
          title={painting.title}
          onClose={() => setZoomed(false)}
        />
      )}
    </>
  );
}

export default function ProductGrid() {
  const [soldIds, setSoldIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/paintings/sold")
      .then((r) => r.json())
      .then((data: { soldIds: number[] }) => setSoldIds(new Set(data.soldIds)))
      .catch(() => {});
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
              Orijinal Eserler
            </p>
            <h2
              className="text-5xl lg:text-6xl font-light text-white leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Koleksiyon
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paintings.map((painting) => (
            <ProductCard key={painting.id} painting={painting} soldIds={soldIds} />
          ))}
        </div>
      </div>
    </section>
  );
}
