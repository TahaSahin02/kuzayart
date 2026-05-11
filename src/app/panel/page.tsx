"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Order {
  id: number;
  merchant_oid: string;
  painting_titles: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
}

const statusLabel: Record<string, { text: string; color: string }> = {
  pending: { text: "Bekliyor", color: "#c9a96e" },
  success: { text: "Tamamlandı", color: "#4ade80" },
  failed: { text: "Başarısız", color: "#f87171" },
};

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function Panel() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("kz_user");
    if (!stored) {
      router.replace("/giris?next=/panel");
      return;
    }
    setUser(JSON.parse(stored));

    fetch("/api/user/orders")
      .then((r) => {
        if (r.status === 401) { router.replace("/giris?next=/panel"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setOrders(data); })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("kz_user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: "1000px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingTop: "130px",
            paddingBottom: "120px",
          }}
        >
          {/* Başlık */}
          <div
            className="flex items-start justify-between mb-12 pb-8"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <p
                className="text-xs tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Hesabım
              </p>
              <h1
                className="font-light"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "2.5rem",
                  color: "#f0ece4",
                }}
              >
                {user.name}
              </h1>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="/#collection"
                className="text-xs tracking-[0.2em] uppercase px-5 py-3 transition-all duration-300"
                style={{ border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e" }}
              >
                Koleksiyon
              </Link>
              <button
                onClick={logout}
                className="text-xs tracking-[0.2em] uppercase px-5 py-3 transition-all duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
              >
                Çıkış
              </button>
            </div>
          </div>

          {/* Siparişler */}
          <div>
            <p
              className="text-xs tracking-[0.35em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Siparişlerim
            </p>

            {loading ? (
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                Yükleniyor...
              </p>
            ) : orders.length === 0 ? (
              <div
                className="py-16 text-center"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p
                  className="font-light mb-4"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "1.5rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Henüz siparişiniz yok.
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
              <div className="flex flex-col gap-4">
                {orders.map((order) => {
                  const s = statusLabel[order.status] ?? { text: order.status, color: "#fff" };
                  return (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#f0ece4" }}>
                          {order.painting_titles}
                        </p>
                        <p
                          className="text-xs mt-1 tracking-wider"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {new Date(order.created_at).toLocaleDateString("tr-TR")} ·{" "}
                          {order.merchant_oid}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <p
                          className="text-lg font-light"
                          style={{ fontFamily: "var(--font-cormorant)", color: "#f0ece4" }}
                        >
                          {fmt(order.amount_cents, order.currency)}
                        </p>
                        <span
                          className="text-xs tracking-[0.15em] uppercase px-3 py-1"
                          style={{
                            color: s.color,
                            border: `1px solid ${s.color}40`,
                            background: `${s.color}10`,
                          }}
                        >
                          {s.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
