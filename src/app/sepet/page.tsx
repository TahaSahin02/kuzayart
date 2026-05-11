"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/paintings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Sepet() {
  const { items, removeItem, total } = useCart();

  return (
    <>
      <Header />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingTop: "130px",
            paddingBottom: "120px",
          }}
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Alışveriş
          </p>
          <h1
            className="font-light mb-12"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2.8rem",
              color: "#f0ece4",
            }}
          >
            Sepetim
          </h1>

          {items.length === 0 ? (
            <div
              className="py-20 text-center"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p
                className="font-light mb-5"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.8rem",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                Sepetiniz boş.
              </p>
              <Link
                href="/#collection"
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: "#c9a96e" }}
              >
                Koleksiyona göz at →
              </Link>
            </div>
          ) : (
            <>
              {/* Ürünler */}
              <div
                className="flex flex-col gap-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-6 py-6"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="relative flex-shrink-0"
                      style={{ width: 80, height: 60 }}
                    >
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-light"
                        style={{
                          fontFamily: "var(--font-cormorant)",
                          fontSize: "1.2rem",
                          color: "#f0ece4",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-xs mt-0.5 tracking-wider"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {item.medium} · {item.dimensions}
                      </p>
                    </div>
                    <p
                      className="font-light text-xl flex-shrink-0"
                      style={{ fontFamily: "var(--font-cormorant)", color: "#f0ece4" }}
                    >
                      {formatPrice(item.price)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                      aria-label="Kaldır"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Toplam + Satın al */}
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Toplam
                  </p>
                  <p
                    className="font-light"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "2rem",
                      color: "#f0ece4",
                    }}
                  >
                    {formatPrice(total)}
                  </p>
                </div>
                <Link
                  href="/odeme"
                  className="px-10 py-4 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-90"
                  style={{ background: "#c9a96e", color: "#0a0a0a", fontWeight: 500 }}
                >
                  Satın Al
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
