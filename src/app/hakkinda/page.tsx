import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Hakkında — KuzayArt" };

export default function Hakkinda() {
  return (
    <>
      <Header />
      <main style={{ background: "#0a0a0a" }}>

        {/* Hero */}
        <section
          className="relative w-full flex items-end overflow-hidden"
          style={{ height: "100svh" }}
        >
          <Image
            src="/paintings/tarama3.png"
            alt="Didem Kuzay"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          {/* Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.2) 100%)",
            }}
          />
          <div
            className="relative z-10 w-full"
            style={{
              maxWidth: "1400px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "24px",
              paddingRight: "24px",
              paddingBottom: "80px",
            }}
          >
            <p
              className="text-xs tracking-[0.35em] uppercase mb-4"
              style={{ color: "#c9a96e", opacity: 0.9 }}
            >
              Sanatçı
            </p>
            <h1
              className="font-light leading-none"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(3.5rem, 10vw, 8rem)",
                color: "#f0ece4",
                letterSpacing: "0.02em",
              }}
            >
              Didem Kuzay
            </h1>
            <p
              className="mt-5 text-sm tracking-[0.15em] uppercase"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Yağlıboya Ressam
            </p>
          </div>
        </section>

        {/* Alıntı */}
        <section
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "96px",
            paddingBottom: "96px",
          }}
        >
          <div
            style={{
              maxWidth: "900px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <blockquote
              className="font-light leading-relaxed text-center"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                color: "#f0ece4",
                letterSpacing: "0.01em",
              }}
            >
              &ldquo;Her tablo, doğanın bir anını sonsuza taşıma çabasıdır.
              Fırtınanın tam öncesi, ayın suya değdiği o kesit —
              geçip giden ama iz bırakan an.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Biyografi */}
        <section
          style={{
            paddingTop: "100px",
            paddingBottom: "100px",
          }}
        >
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start"
            style={{
              maxWidth: "1400px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            {/* Sol — başlık */}
            <div className="md:sticky top-32">
              <p
                className="text-xs tracking-[0.35em] uppercase mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Biyografi
              </p>
              <h2
                className="font-light leading-tight"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  color: "#f0ece4",
                }}
              >
                Doğanın Gücünü
                <br />
                Tuvale Taşımak
              </h2>
              <div
                className="mt-8 w-12"
                style={{ height: "1px", background: "#c9a96e", opacity: 0.5 }}
              />
            </div>

            {/* Sağ — metin */}
            <div
              className="flex flex-col gap-6 text-sm leading-loose"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              <p>
                Didem Kuzay, doğanın sert ve büyüleyici yüzüne odaklanan Türk bir yağlıboya
                ressam. Çalışmalarında fırtına öncesi gökyüzünün gerilimini, ayın denizle
                kurduğu sessiz diyaloğu ve alacakaranlığın suya yansıyan altın ışığını
                konu alıyor.
              </p>
              <p>
                Her eser, anlık bir duygunun tuval üzerinde kalıcı hale getirilmiş hali.
                Kuzay için resim yapmak, gözün yakaladığı ama belleğin tutamadığı o kısa
                anı geri çağırma çabasıdır: dalganın zirvesi, bulutların içine gömülen ışık,
                koyu suyun üzerinde titreyen gece.
              </p>
              <p>
                Yağlıboyanın katmanlı yapısı ve zengin dokusu, bu dramatik atmosferleri
                aktarmak için biçilmiş kaftandır. Kuzay, derinlik yaratmak amacıyla
                birden fazla renk tabakası uygular; son katman kurumadan taşınan fırça
                izleri ise tabloya ham ve canlı bir enerji katar.
              </p>
              <p>
                Tüm eserleri tek kopya ve özgündür. Her tablo, sanatçı imzası ve
                özgünlük sertifikasıyla birlikte teslim edilir.
              </p>
            </div>
          </div>
        </section>

        {/* Yaklaşım — 3 sütun */}
        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "100px",
            paddingBottom: "100px",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <p
              className="text-xs tracking-[0.35em] uppercase mb-16"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Yaklaşım
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  no: "01",
                  title: "Teknik",
                  body: "Klasik yağlıboya tekniğiyle çalışan Kuzay, ıslak üstüne ıslak (wet-on-wet) yöntemiyle renkleri birbirine karıştırarak doğanın yumuşak geçişlerini tuval üzerinde yeniden kurar.",
                },
                {
                  no: "02",
                  title: "Konu",
                  body: "Deniz manzaraları, dramatik gökyüzü ve gece sahneleri. İnsan figürünü dışarıda bırakan bu kompozisyonlar, izleyiciyi doğrudan doğayla yüz yüze getirir.",
                },
                {
                  no: "03",
                  title: "Eser",
                  body: "Her tablo yalnızca bir kez üretilir. Sanatçı imzalı özgünlük sertifikasıyla birlikte teslim edilen eserler, kişisel koleksiyon ve kurumsal mekânlar için tasarlanmıştır.",
                },
              ].map((item) => (
                <div key={item.no}>
                  <p
                    className="text-xs tracking-[0.2em] mb-5"
                    style={{ color: "#c9a96e", opacity: 0.7 }}
                  >
                    {item.no}
                  </p>
                  <h3
                    className="font-light mb-4"
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "1.5rem",
                      color: "#f0ece4",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* İletişim CTA */}
        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "100px",
            paddingBottom: "120px",
          }}
        >
          <div
            className="text-center"
            style={{
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <p
              className="text-xs tracking-[0.35em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              İletişim
            </p>
            <h2
              className="font-light mb-8"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#f0ece4",
              }}
            >
              Bir eser hakkında soru mu var?
            </h2>
            <p
              className="text-sm leading-relaxed mb-10"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Koleksiyon, ölçü veya teslimat hakkında merak ettikleriniz için
              doğrudan ulaşın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@kuzayart.com"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#c9a96e] hover:border-[#c9a96e] hover:text-black"
                style={{
                  border: "1px solid rgba(201,169,110,0.5)",
                  color: "#c9a96e",
                }}
              >
                E-posta Gönder
              </a>
              <a
                href="tel:+905332760897"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.25em] uppercase transition-colors duration-300 hover:text-white/80"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                +90 533 276 08 97
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
