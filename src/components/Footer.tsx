export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" style={{ background: "#111111", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Top band */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">

          {/* Brand column */}
          <div className="md:col-span-4">
            <h3
              className="text-4xl font-light text-white mb-4 tracking-wide"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              KuzayArt
            </h3>
            <p className="text-sm text-white/40 leading-[1.8] mb-8 max-w-[280px]">
              Didem Kuzay&apos;ın özgün yağlıboya eserleri. Doğanın fırtınalı güzelliğini
              tuvale taşıyan, koleksiyonerlere özel sanat deneyimi.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4">
              {["Instagram", "Pinterest"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-[11px] tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors duration-300 pb-0.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Navigation */}
          <div className="md:col-span-2">
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-6">Sayfalar</p>
            <ul className="flex flex-col gap-4">
              {[
                { label: "Galeri", href: "#gallery" },
                { label: "Koleksiyon", href: "#collection" },
                { label: "İletişim", href: "#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-white/45 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-6">Bilgi</p>
            <ul className="flex flex-col gap-4">
              {["Orijinallik Sertifikası", "Kargo & Teslimat", "İade Politikası"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/45 hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-6">İletişim</p>
            <ul className="flex flex-col gap-4 text-sm text-white/45">
              <li>
                <a href="mailto:info@kuzayart.com" className="hover:text-white transition-colors duration-300">
                  info@kuzayart.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-300">
                  @kuzayart
                </a>
              </li>
              <li className="text-white/25">Türkiye · Dünya geneli kargo</li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3">
                Yeni eserlerden haberdar ol
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="E-posta adresin"
                  className="flex-1 bg-white/5 border border-white/10 text-sm text-white/70 placeholder-white/20 px-4 py-2.5 outline-none focus:border-white/25 transition-colors duration-300 rounded-l-sm"
                />
                <button
                  className="px-4 py-2.5 text-xs tracking-wider text-white/80 hover:text-white transition-colors duration-300 border border-l-0 border-white/10 hover:border-white/25 rounded-r-sm"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/20 tracking-wider">
            © {year} KuzayArt — Tüm hakları saklıdır.
          </p>
          <p className="text-[11px] text-white/15 tracking-wider">
            Didem Kuzay tarafından yaratılmıştır.
          </p>
        </div>
      </div>
    </footer>
  );
}
