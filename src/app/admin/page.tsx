"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  merchant_oid: string;
  painting_titles: string;
  amount_cents: number;
  currency: string;
  status: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
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

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    orders: Order[];
    customers: Customer[];
    totalRevenueCents: number;
  } | null>(null);
  const [tab, setTab] = useState<"orders" | "customers">("orders");

  const fetchData = async () => {
    const res = await fetch("/api/admin/data");
    if (res.status === 401) { setAuth(false); setLoading(false); return; }
    const json = await res.json();
    setData(json);
    setAuth(true);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) { setLoginError("Yanlış şifre."); return; }
    fetchData();
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0ece4",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none",
    width: "100%",
  } as React.CSSProperties;

  const thStyle = {
    padding: "12px 16px",
    textAlign: "left" as const,
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.35)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  };

  const tdStyle = {
    padding: "14px 16px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.7)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    verticalAlign: "top" as const,
  };

  if (loading) {
    return (
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }} className="flex items-center justify-center">
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Yükleniyor...</p>
      </main>
    );
  }

  if (!auth) {
    return (
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }} className="flex items-center justify-center">
        <div style={{ width: "100%", maxWidth: "380px", padding: "24px" }}>
          <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            Yönetici
          </p>
          <h1
            className="font-light mb-8"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", color: "#f0ece4" }}
          >
            Admin Paneli
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Yönetici şifresi"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            {loginError && <p className="text-sm" style={{ color: "#f87171" }}>{loginError}</p>}
            <button
              type="submit"
              className="py-4 text-xs tracking-[0.25em] uppercase"
              style={{ background: "#c9a96e", color: "#0a0a0a", fontWeight: 500 }}
            >
              Giriş
            </button>
          </form>
        </div>
      </main>
    );
  }

  const successOrders = data!.orders.filter((o) => o.status === "success");

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", padding: "48px 24px" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              KuzayArt
            </p>
            <h1 className="font-light" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", color: "#f0ece4" }}>
              Admin Paneli
            </h1>
          </div>
          <a href="/" className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            ← Siteye Dön
          </a>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Toplam Gelir", value: fmt(data!.totalRevenueCents, "EUR") },
            { label: "Tamamlanan", value: successOrders.length },
            { label: "Toplam Sipariş", value: data!.orders.length },
            { label: "Müşteri", value: data!.customers.length },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "20px" }}
            >
              <p className="text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                {stat.label}
              </p>
              <p className="font-light text-2xl" style={{ fontFamily: "var(--font-cormorant)", color: "#f0ece4" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Sekmeler */}
        <div className="flex gap-1 mb-6">
          {(["orders", "customers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all"
              style={{
                background: tab === t ? "rgba(201,169,110,0.15)" : "transparent",
                border: `1px solid ${tab === t ? "rgba(201,169,110,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: tab === t ? "#c9a96e" : "rgba(255,255,255,0.4)",
              }}
            >
              {t === "orders" ? `Siparişler (${data!.orders.length})` : `Müşteriler (${data!.customers.length})`}
            </button>
          ))}
        </div>

        {/* Tablo */}
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
          {tab === "orders" ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Sipariş No</th>
                  <th style={thStyle}>Eser</th>
                  <th style={thStyle}>Müşteri</th>
                  <th style={thStyle}>Tutar</th>
                  <th style={thStyle}>Durum</th>
                  <th style={thStyle}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {data!.orders.map((o) => {
                  const s = statusLabel[o.status] ?? { text: o.status, color: "#fff" };
                  return (
                    <tr key={o.id}>
                      <td style={tdStyle}>
                        <span style={{ fontFamily: "monospace", fontSize: "11px" }}>{o.merchant_oid}</span>
                      </td>
                      <td style={tdStyle}>{o.painting_titles}</td>
                      <td style={tdStyle}>
                        <span style={{ color: "#f0ece4" }}>{o.user_name}</span>
                        <br />
                        <span style={{ fontSize: "12px" }}>{o.user_email}</span>
                      </td>
                      <td style={{ ...tdStyle, color: "#f0ece4" }}>
                        {fmt(o.amount_cents, o.currency)}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            color: s.color,
                            border: `1px solid ${s.color}40`,
                            padding: "2px 8px",
                            fontSize: "11px",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {s.text}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontSize: "12px" }}>
                        {new Date(o.created_at).toLocaleDateString("tr-TR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Ad Soyad</th>
                  <th style={thStyle}>E-posta</th>
                  <th style={thStyle}>Telefon</th>
                  <th style={thStyle}>Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody>
                {data!.customers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ ...tdStyle, color: "#f0ece4" }}>{c.name}</td>
                    <td style={tdStyle}>{c.email}</td>
                    <td style={tdStyle}>{c.phone ?? "—"}</td>
                    <td style={{ ...tdStyle, fontSize: "12px" }}>
                      {new Date(c.created_at).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </main>
  );
}
