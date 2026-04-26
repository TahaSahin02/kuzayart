export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-28 px-6 lg:px-16"
      style={{ background: "linear-gradient(to bottom, #0a0a0a, #0f0f0f)" }}
    >
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Decorative line */}
        <div className="hidden md:block w-[1px] self-stretch bg-gradient-to-b from-transparent via-[#c9a96e] to-transparent opacity-40 shrink-0" />

        <div className="flex-1">
          <p className="text-xs tracking-[0.35em] uppercase text-[#c9a96e] mb-4">
            Sanatçı Hakkında
          </p>
          <h2
            className="text-5xl lg:text-6xl font-light text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Didem Kuzay
          </h2>
          <p className="text-[15px] leading-[1.9] text-white/50 max-w-xl mb-6">
            Doğanın en dramatik anlarını tuval üzerine taşıyan Didem Kuzay,
            özellikle deniz manzaraları ve fırtınalı gökyüzüyle tanınmaktadır.
            Yağlıboya tekniğindeki ustalığı sayesinde her eserde ışık, hareket
            ve duygu bir arada buluşur.
          </p>
          <p className="text-[15px] leading-[1.9] text-white/35 max-w-xl">
            Her tablo, saatler süren gözlem ve titiz bir çalışmanın ürünüdür.
            Koleksiyonundaki eserler dünya genelinde özel koleksiyonerlerin
            duvarlarını süslemektedir.
          </p>
        </div>

        {/* Stats */}
        <div className="shrink-0 grid grid-cols-2 gap-8">
          {[
            { number: "50+", label: "Özgün Eser" },
            { number: "12+", label: "Yıl Deneyim" },
            { number: "30+", label: "Koleksiyoner" },
            { number: "4", label: "Ülkede Eser" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-6 rounded-sm"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,169,110,0.1)",
              }}
            >
              <span
                className="text-4xl font-light gold-shimmer mb-1"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {stat.number}
              </span>
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/30">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
