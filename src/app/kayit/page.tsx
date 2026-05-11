"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Kayit() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    localStorage.setItem("kz_user", JSON.stringify(data.user));
    router.push("/panel");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0ece4",
    width: "100%",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none",
  } as React.CSSProperties;

  return (
    <>
      <Header />
      <main
        style={{ background: "#0a0a0a", minHeight: "100vh" }}
        className="flex items-center justify-center"
      >
        <div style={{ width: "100%", maxWidth: "420px", padding: "24px" }}>
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Yeni hesap
          </p>
          <h1
            className="font-light mb-10"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2.5rem",
              color: "#f0ece4",
            }}
          >
            Kayıt Ol
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {[
              { key: "name", label: "Ad Soyad", type: "text", required: true },
              { key: "email", label: "E-posta", type: "email", required: true },
              { key: "password", label: "Şifre", type: "password", required: true },
              { key: "phone", label: "Telefon (isteğe bağlı)", type: "tel", required: false },
            ].map(({ key, label, type, required }) => (
              <div key={key}>
                <label
                  className="block text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  required={required}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
              </div>
            ))}

            {error && (
              <p className="text-sm" style={{ color: "#f87171" }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
              <button
                type="submit"
                disabled={loading}
                className="text-xs tracking-[0.3em] uppercase transition-all duration-300"
                style={{
                  background: "transparent",
                  border: `1px solid ${loading ? "rgba(201,169,110,0.3)" : "#c9a96e"}`,
                  color: loading ? "rgba(201,169,110,0.4)" : "#c9a96e",
                  padding: "14px 56px",
                  fontWeight: 400,
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.3em",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#c9a96e";
                    e.currentTarget.style.color = "#0a0a0a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#c9a96e";
                  }
                }}
              >
                {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-sm text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
            Zaten hesabınız var mı?{" "}
            <Link href="/giris" style={{ color: "#c9a96e" }}>
              Giriş yapın
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
