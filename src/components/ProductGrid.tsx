"use client";

import { useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, ShoppingCartIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";

const ZoomModal = dynamic(() => import("./ZoomModal"), { ssr: false });

interface Painting {
  id: number;
  src: string;
  title: string;
  subtitle: string;
  medium: string;
  dimensions: string;
  year: string;
  price: number;
  sold: boolean;
}

const paintings: Painting[] = [
  {
    id: 1,
    src: "/paintings/tarama1.png",
    title: "Fırtınanın Eşiğinde",
    subtitle: "Dramatik yükseltiler ve bulutların muhteşem dansı",
    medium: "Yağlı Boya",
    dimensions: "100 × 70 cm",
    year: "2025",
    price: 1200,
    sold: false,
  },
  {
    id: 2,
    src: "/paintings/tarama2.png",
    title: "Akdeniz Dalgası",
    subtitle: "Türkuaz denizin güç ve zarafeti",
    medium: "Yağlı Boya",
    dimensions: "120 × 80 cm",
    year: "2025",
    price: 1800,
    sold: false,
  },
  {
    id: 3,
    src: "/paintings/tarama3.png",
    title: "Gece Koyu",
    subtitle: "Ay ışığının koyun karanlık suları üzerindeki sihri",
    medium: "Yağlı Boya",
    dimensions: "90 × 70 cm",
    year: "2025",
    price: 950,
    sold: false,
  },
  {
    id: 4,
    src: "/paintings/tarama4.png",
    title: "Altın Alacakaranlık",
    subtitle: "Günbatımının dalgalar üzerindeki sıcak altın ışığı",
    medium: "Yağlı Boya",
    dimensions: "80 × 60 cm",
    year: "2026",
    price: 750,
    sold: false,
  },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function ProductCard({ painting }: { painting: Painting }) {
  const [zoomed, setZoomed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <article
        className="product-card group relative flex flex-col rounded-sm overflow-hidden"
        style={{
          background: "#c8c0b0",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
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

          {/* Overlay on hover */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(0,0,0,0.45)" }}
          >
            <button
              onClick={() => setZoomed(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-[0.2em] uppercase font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              Yakınlaştır
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
          {painting.sold && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
              <span className="px-6 py-2 text-xs tracking-[0.35em] uppercase font-medium text-white border border-white/30">
                Satıldı
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3 p-6">
          <div>
            <h3
              className="text-2xl font-light leading-snug text-black transition-colors duration-300"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {painting.title}
            </h3>
            <p className="text-sm text-black/50 mt-1.5 leading-relaxed">{painting.subtitle}</p>
          </div>

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
              <p className="text-[11px] tracking-[0.2em] uppercase text-black/35 mb-1">Fiyat</p>
              <p
                className="text-3xl font-light text-black"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {formatPrice(painting.price)}
              </p>
            </div>

            {!painting.sold && (
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-5 py-3 text-xs tracking-[0.15em] uppercase transition-all duration-300 active:scale-95 rounded-sm"
                style={{
                  background: added ? "rgba(0,0,0,0.08)" : "transparent",
                  border: "1px solid rgba(0,0,0,0.2)",
                  color: "rgba(0,0,0,0.65)",
                }}
              >
                <ShoppingCartIcon className="w-4 h-4" />
                {added ? "Eklendi!" : "Sepete Ekle"}
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
  return (
    <section id="collection" style={{ paddingTop: "96px", paddingBottom: "200px" }}>
      <div style={{ maxWidth: "1400px", marginLeft: "auto", marginRight: "auto", paddingLeft: "24px", paddingRight: "24px" }}>
        {/* Section header */}
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
          <p className="text-sm text-white/35 max-w-xs leading-relaxed">
            Her eser özgün bir yağlıboya tablo olup sanatçı imzalı sertifikasıyla birlikte teslim edilir.
          </p>
        </div>

        {/* Grid — 2 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paintings.map((painting) => (
            <ProductCard key={painting.id} painting={painting} />
          ))}
        </div>
      </div>
    </section>
  );
}
