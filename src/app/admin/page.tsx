"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

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

const STATUS = {
  pending: { text: "Bekliyor",     color: "#c9a96e" },
  success: { text: "Tamamlandı",   color: "#4ade80" },
  failed:  { text: "Başarısız",    color: "#f87171" },
};

/* ── Painting Form (add / edit) ── */
type PaintingFormData = Omit<Painting, "id"> & { id?: number };

function PaintingForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Painting | null;
  onSave: (p: Painting) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [preview, setPreview]     = useState<string>(initial?.src ?? "");

  const [form, setForm] = useState<PaintingFormData>({
    src:          initial?.src          ?? "",
    title:        initial?.title        ?? "",
    medium:       initial?.medium       ?? "Yağlı Boya",
    dimensions:   initial?.dimensions   ?? "",
    year:         initial?.year         ?? new Date().getFullYear().toString(),
    price:        initial?.price        ?? 0,
    print_price:  initial?.print_price  ?? 0,
    is_sold:      initial?.is_sold      ?? false,
    show_in_hero: initial?.show_in_hero ?? true,
    hero_order:   initial?.hero_order   ?? 0,
  });

  const set = (k: keyof PaintingFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res  = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json() as { url: string };
    setForm((f) => ({ ...f, src: data.url }));
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url    = initial?.id ? `/api/admin/paintings/${initial.id}` : "/api/admin/paintings";
    const method = initial?.id ? "PATCH" : "POST";
    const res    = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), print_price: Number(form.print_price), hero_order: Number(form.hero_order) }),
    });
    const saved = await res.json() as Painting;
    setSaving(false);
    onSave(saved);
  };

  const inp = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0ece4", padding: "10px 12px", fontSize: "13px", outline: "none",
    width: "100%", borderRadius: "2px",
  } as React.CSSProperties;

  const lbl = { fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: "6px" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", padding: "32px", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", borderRadius: "4px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.6rem", fontWeight: 300, color: "#f0ece4" }}>
            {initial ? "Eseri Düzenle" : "Yeni Eser Ekle"}
          </h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "22px", cursor: "pointer" }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

            {/* Image upload */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Görsel *</label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: "2px dashed rgba(255,255,255,0.15)", borderRadius: "4px",
                  padding: "20px", cursor: "pointer", textAlign: "center",
                  position: "relative", minHeight: preview ? "200px" : "100px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {preview ? (
                  <Image src={preview} alt="preview" fill style={{ objectFit: "contain" }} sizes="600px" unoptimized={preview.startsWith("blob:")} />
                ) : (
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                    {uploading ? "Yükleniyor..." : "Tıkla ve resim seç"}
                  </p>
                )}
                {uploading && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ color: "#c9a96e", fontSize: "13px" }}>Yükleniyor...</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
              {form.src && !preview.startsWith("blob:") && (
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px", wordBreak: "break-all" }}>{form.src}</p>
              )}
            </div>

            {/* Title */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Eser Adı *</label>
              <input required type="text" value={form.title} onChange={set("title")} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Medium */}
            <div>
              <label style={lbl}>Teknik</label>
              <input type="text" value={form.medium} onChange={set("medium")} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Year */}
            <div>
              <label style={lbl}>Yıl</label>
              <input type="text" value={form.year} onChange={set("year")} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Dimensions */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Boyut (örn: 100 × 70 cm)</label>
              <input type="text" value={form.dimensions} onChange={set("dimensions")} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Price */}
            <div>
              <label style={lbl}>Orijinal Fiyat (EUR) *</label>
              <input required type="number" min="0" value={form.price} onChange={set("price")} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Print price */}
            <div>
              <label style={lbl}>Baskı Fiyatı (EUR)</label>
              <input type="number" min="0" value={form.print_price} onChange={set("print_price")} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Hero order */}
            <div>
              <label style={lbl}>Hero Sırası</label>
              <input type="number" min="0" value={form.hero_order} onChange={set("hero_order")} style={inp}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>

            {/* Toggles */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "flex-end" }}>
              {[
                { key: "is_sold",      label: "Satıldı" },
                { key: "show_in_hero", label: "Hero'da Göster" },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input type="checkbox" checked={form[key as keyof PaintingFormData] as boolean}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                    style={{ accentColor: "#c9a96e", width: "16px", height: "16px" }} />
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{label}</span>
                </label>
              ))}
            </div>

          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "28px", justifyContent: "flex-end" }}>
            <button type="button" onClick={onCancel}
              style={{ padding: "11px 28px", fontSize: "12px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
              İptal
            </button>
            <button type="submit" disabled={saving || uploading}
              style={{ padding: "11px 36px", fontSize: "12px", letterSpacing: "0.2em", background: saving ? "rgba(201,169,110,0.5)" : "#c9a96e", color: "#0a0a0a", fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "KAYDEDİLİYOR..." : "KAYDET"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Collection tab ── */
function CollectionTab() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState<Painting | null | "new">(null);
  const [deleting, setDeleting]   = useState<number | null>(null);

  const load = () => {
    fetch("/api/admin/paintings")
      .then((r) => r.json())
      .then((d: Painting[]) => { setPaintings(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = (p: Painting) => {
    setPaintings((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      return idx >= 0 ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p];
    });
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu eseri silmek istediğinizden emin misiniz?")) return;
    setDeleting(id);
    await fetch(`/api/admin/paintings/${id}`, { method: "DELETE" });
    setPaintings((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const toggleField = async (p: Painting, field: "is_sold" | "show_in_hero") => {
    const updated = { ...p, [field]: !p[field] };
    setPaintings((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    await fetch(`/api/admin/paintings/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !p[field] }),
    });
  };

  if (loading) return <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Yükleniyor...</p>;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>{paintings.length} eser</p>
        <button onClick={() => setEditing("new")}
          style={{ padding: "10px 24px", fontSize: "12px", letterSpacing: "0.2em", background: "#c9a96e", color: "#0a0a0a", fontWeight: 600, border: "none", cursor: "pointer" }}>
          + YENİ ESER EKLE
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {paintings.map((p) => (
          <div key={p.id} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden", background: "rgba(255,255,255,0.02)" }}>

            {/* Image */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#1a1a1a" }}>
              <Image src={p.src} alt={p.title} fill style={{ objectFit: "cover" }} sizes="300px" unoptimized={p.src.startsWith("http")} />
              {p.is_sold && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "11px", letterSpacing: "0.3em", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "4px 14px" }}>SATILDI</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.15rem", fontWeight: 300, color: "#f0ece4", marginBottom: "4px" }}>{p.title}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "10px" }}>
                {p.medium} · {p.dimensions} · {p.year}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#c9a96e" }}>€{p.price}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>Baskı €{p.print_price}</span>
              </div>

              {/* Satış durumu — iki seçenek */}
              <div style={{ marginBottom: "10px" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>SATIŞ DURUMU</p>
                <div style={{ display: "flex", gap: "0" }}>
                  <button
                    onClick={() => { if (p.is_sold) toggleField(p, "is_sold"); }}
                    style={{
                      flex: 1, padding: "8px 6px", fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer",
                      border: "1px solid", borderRight: "none",
                      borderColor: !p.is_sold ? "#4ade80" : "rgba(255,255,255,0.12)",
                      background: !p.is_sold ? "rgba(74,222,128,0.15)" : "transparent",
                      color: !p.is_sold ? "#4ade80" : "rgba(255,255,255,0.35)",
                      fontWeight: !p.is_sold ? 600 : 400,
                    }}
                  >
                    {!p.is_sold ? "✓ SATIŞTA" : "SATIŞTA"}
                  </button>
                  <button
                    style={{
                      flex: 1, padding: "8px 6px", fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer",
                      border: "1px solid",
                      borderColor: p.is_sold ? "#f87171" : "rgba(255,255,255,0.12)",
                      background: p.is_sold ? "rgba(248,113,113,0.15)" : "transparent",
                      color: p.is_sold ? "#f87171" : "rgba(255,255,255,0.35)",
                      fontWeight: p.is_sold ? 600 : 400,
                    }}
                    onClick={() => { if (!p.is_sold) toggleField(p, "is_sold"); }}
                  >
                    {p.is_sold ? "✓ SATILDI" : "SATILDI"}
                  </button>
                </div>
              </div>

              {/* Hero toggle */}
              <div style={{ marginBottom: "12px" }}>
                <button onClick={() => toggleField(p, "show_in_hero")}
                  style={{ width: "100%", padding: "7px 8px", fontSize: "10px", letterSpacing: "0.1em", cursor: "pointer", border: "1px solid", borderColor: p.show_in_hero ? "#c9a96e" : "rgba(255,255,255,0.12)", background: p.show_in_hero ? "rgba(201,169,110,0.12)" : "transparent", color: p.show_in_hero ? "#c9a96e" : "rgba(255,255,255,0.35)" }}>
                  {p.show_in_hero ? "✓ HERO'DA GÖSTERİLİYOR" : "HERO'DA GÖSTER"}
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setEditing(p)}
                  style={{ flex: 1, padding: "8px", fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer", background: "transparent", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e" }}>
                  DÜZENLE
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                  style={{ padding: "8px 14px", fontSize: "11px", cursor: "pointer", background: "transparent", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
                  SİL
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <PaintingForm
          initial={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </>
  );
}

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
  const [tab, setTab]         = useState<"orders" | "customers" | "collection">("orders");
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
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
          {([
            { key: "collection", label: "KOLEKSİYON" },
            { key: "orders",     label: `SİPARİŞLER (${data!.orders.length})` },
            { key: "customers",  label: `MÜŞTERİLER (${data!.customers.length})` },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              style={{
                padding: "8px 20px", fontSize: "11px", letterSpacing: "0.15em",
                background: tab === key ? "rgba(201,169,110,0.12)" : "transparent",
                border: `1px solid ${tab === key ? "rgba(201,169,110,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: tab === key ? "#c9a96e" : "rgba(255,255,255,0.4)", cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "collection" && <CollectionTab />}

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
