"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  merchant_oid: string;
  painting_titles: string;
  amount_cents: number;
  amount_eur_cents: number | null;
  currency: string;
  status: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  user_address: string | null;
  user_city: string | null;
  user_postal_code: string | null;
  user_country: string | null;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

const STATUS = {
  pending: { text: "Bekliyor",     color: "#c9a96e" },
  success: { text: "Tamamlandı",   color: "#4ade80" },
  failed:  { text: "Başarısız",    color: "#f87171" },
};

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(cents / 100);
}

function date(str: string) {
  return new Date(str).toLocaleDateString("tr-TR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Expanded order card ── */
function OrderCard({ o }: { o: Order }) {
  const [open, setOpen] = useState(false);
  const s = STATUS[o.status as keyof typeof STATUS] ?? { text: o.status, color: "#fff" };

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>

      {/* Header row — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", textAlign: "left", background: "transparent",
          padding: "18px 20px", display: "grid", cursor: "pointer",
          gridTemplateColumns: "1fr 2fr 1.5fr auto auto auto",
          gap: "16px", alignItems: "center",
          borderBottom: open ? "1px solid rgba(255,255,255,0.07)" : "none",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
          {o.merchant_oid}
        </span>
        <span style={{ fontSize: "13px", color: "#f0ece4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {o.painting_titles}
        </span>
        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
          {o.user_name}
        </span>
        <span style={{ fontSize: "14px", color: "#f0ece4", fontWeight: 500 }}>
          {fmt(o.amount_cents, o.currency)}
        </span>
        <span style={{
          fontSize: "11px", letterSpacing: "0.1em", padding: "3px 10px",
          color: s.color, border: `1px solid ${s.color}40`, background: `${s.color}10`,
          whiteSpace: "nowrap",
        }}>
          {s.text}
        </span>
        <span style={{ fontSize: "18px", color: "rgba(255,255,255,0.3)", userSelect: "none" }}>
          {open ? "−" : "+"}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div style={{ padding: "24px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", background: "rgba(255,255,255,0.015)" }}>

          {/* Customer */}
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>
              Müşteri
            </p>
            <Detail label="Ad Soyad"  value={o.user_name || "—"} highlight />
            <Detail label="E-posta"   value={o.user_email || "—"} />
            <Detail label="Telefon"   value={o.user_phone || "—"} />
          </div>

          {/* Address */}
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>
              Teslimat Adresi
            </p>
            <Detail label="Adres"     value={o.user_address || "—"} />
            <Detail label="Şehir"     value={o.user_city || "—"} />
            <Detail label="Posta Kodu" value={o.user_postal_code || "—"} />
            <Detail label="Ülke"      value={o.user_country || "—"} />
          </div>

          {/* Order */}
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>
              Sipariş
            </p>
            <Detail label="Eser"      value={o.painting_titles} />
            <Detail label="TRY"       value={fmt(o.amount_cents, o.currency)} highlight />
            {o.amount_eur_cents ? (
              <Detail label="EUR" value={fmt(o.amount_eur_cents, "EUR")} />
            ) : null}
            <Detail label="Durum"     value={s.text} color={s.color} />
            <Detail label="Tarih"     value={date(o.created_at)} />
            <Detail label="Sipariş No" value={o.merchant_oid} mono />
          </div>

        </div>
      )}
    </div>
  );
}

function Detail({ label, value, highlight, color, mono }: {
  label: string; value: string;
  highlight?: boolean; color?: string; mono?: boolean;
}) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", display: "block", marginBottom: "1px" }}>
        {label}
      </span>
      <span style={{
        fontSize: mono ? "11px" : "13px",
        color: color ?? (highlight ? "#f0ece4" : "rgba(255,255,255,0.6)"),
        fontFamily: mono ? "monospace" : undefined,
        wordBreak: "break-all",
      }}>
        {value}
      </span>
    </div>
  );
}

/* ── Main page ── */
export default function Admin() {
  const [auth, setAuth]       = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState<{ orders: Order[]; customers: Customer[]; totalRevenueCents: number } | null>(null);
  const [tab, setTab]         = useState<"orders" | "customers">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchData = async () => {
    const res = await fetch("/api/admin/data");
    if (res.status === 401) { setAuth(false); setLoading(false); return; }
    const json = await res.json();
    setData(json); setAuth(true); setLoading(false);
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
    color: "#f0ece4", padding: "14px 16px", fontSize: "14px",
    outline: "none", width: "100%",
  } as React.CSSProperties;

  if (loading) return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh" }} className="flex items-center justify-center">
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Yükleniyor...</p>
    </main>
  );

  if (!auth) return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh" }} className="flex items-center justify-center">
      <div style={{ width: "100%", maxWidth: "380px", padding: "24px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>
          Yönetici
        </p>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", fontWeight: 300, color: "#f0ece4", marginBottom: "32px" }}>
          Admin Paneli
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Yönetici şifresi" style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
          {loginError && <p style={{ color: "#f87171", fontSize: "13px" }}>{loginError}</p>}
          <button type="submit" style={{ background: "#c9a96e", color: "#0a0a0a", padding: "14px", fontSize: "12px", letterSpacing: "0.25em", fontWeight: 500, cursor: "pointer", border: "none" }}>
            GİRİŞ
          </button>
        </form>
      </div>
    </main>
  );

  const successOrders = data!.orders.filter((o) => o.status === "success");
  const filtered = data!.orders.filter((o) => statusFilter === "all" || o.status === statusFilter);

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p style={{ fontSize: "11px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>KuzayArt</p>
            <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "2rem", fontWeight: 300, color: "#f0ece4" }}>Admin Paneli</h1>
          </div>
          <a href="/" style={{ fontSize: "12px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)" }}>← Siteye Dön</a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Toplam Gelir (TRY)",  value: fmt(data!.totalRevenueCents, "TRY") },
            { label: "Tamamlanan",           value: String(successOrders.length) },
            { label: "Toplam Sipariş",       value: String(data!.orders.length) },
            { label: "Müşteri",              value: String(data!.customers.length) },
          ].map((s) => (
            <div key={s.label} style={{ border: "1px solid rgba(255,255,255,0.06)", padding: "20px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.7rem", fontWeight: 300, color: "#f0ece4" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
          {(["orders", "customers"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: "8px 20px", fontSize: "11px", letterSpacing: "0.15em",
                background: tab === t ? "rgba(201,169,110,0.12)" : "transparent",
                border: `1px solid ${tab === t ? "rgba(201,169,110,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: tab === t ? "#c9a96e" : "rgba(255,255,255,0.4)", cursor: "pointer",
              }}
            >
              {t === "orders" ? `SİPARİŞLER (${data!.orders.length})` : `MÜŞTERİLER (${data!.customers.length})`}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <>
            {/* Status filter */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              {["all", "pending", "success", "failed"].map((f) => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  style={{
                    padding: "5px 14px", fontSize: "10px", letterSpacing: "0.12em",
                    background: statusFilter === f ? "rgba(255,255,255,0.08)" : "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: statusFilter === f ? "#f0ece4" : "rgba(255,255,255,0.35)", cursor: "pointer",
                  }}
                >
                  {f === "all" ? "TÜMÜ" : f === "pending" ? "BEKLİYOR" : f === "success" ? "TAMAMLANDI" : "BAŞARISIZ"}
                </button>
              ))}
            </div>

            {/* Column header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr auto auto auto",
              gap: "16px", padding: "10px 20px",
              fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)",
              marginBottom: "8px",
            }}>
              <span>Sipariş No</span><span>Eser</span><span>Müşteri</span>
              <span>Tutar</span><span>Durum</span><span></span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {filtered.length === 0
                ? <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", padding: "20px 0" }}>Sipariş yok.</p>
                : filtered.map((o) => <OrderCard key={o.id} o={o} />)
              }
            </div>
          </>
        )}

        {tab === "customers" && (
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Ad Soyad", "E-posta", "Telefon", "Kayıt Tarihi"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data!.customers.map((c) => (
                  <tr key={c.id}>
                    <td style={{ padding: "13px 16px", fontSize: "13px", color: "#f0ece4", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{c.name}</td>
                    <td style={{ padding: "13px 16px", fontSize: "13px", color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{c.email}</td>
                    <td style={{ padding: "13px 16px", fontSize: "13px", color: "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{c.phone ?? "—"}</td>
                    <td style={{ padding: "13px 16px", fontSize: "12px", color: "rgba(255,255,255,0.4)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{date(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  );
}
