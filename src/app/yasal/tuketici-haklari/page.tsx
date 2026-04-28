import LegalShell from "@/components/LegalShell";

export const metadata = { title: "Tüketici Hakları — KuzayArt" };

export default function TuketiciHaklari() {
  return (
    <LegalShell
      title="Tüketici Hakları"
      sections={[
        {
          heading: "1. Genel Hükümler",
          content: (
            <p>
              KuzayArt, müşteri memnuniyetini en üst düzeyde tutmayı hedefler ve Türkiye
              Cumhuriyeti sınırları içerisinde geçerli olan 6502 sayılı Tüketicinin Korunması
              Hakkında Kanun hükümlerine tam uyum sağlamayı taahhüt eder.
            </p>
          ),
        },
        {
          heading: "2. Ayıplı Eser Bildirimi ve Haklar",
          content: (
            <>
              <p>
                Satın alınan eserin web sitesinde açıklanan niteliklere (boyut, teknik, malzeme,
                imza) uymaması ya da eserde üretim kaynaklı kusur bulunması durumunda eser,
                &quot;ayıplı mal&quot; sayılır. Bu durumda alıcı aşağıdaki seçeneklerden birini
                kullanabilir:
              </p>
              <ul className="mt-2 flex flex-col gap-1 pl-4" style={{ listStyle: "disc" }}>
                <li>Bedel iadesini de içeren sözleşmeden dönme</li>
                <li>
                  Eşdeğer özgün eserle değişim (stok ve sanatçı onayına bağlı olarak)
                </li>
                <li>Ayıp oranında satış bedelinden indirim talep etme</li>
              </ul>
            </>
          ),
        },
        {
          heading: "3. Özgünlük Garantisi",
          content: (
            <p>
              KuzayArt&apos;ta satışa sunulan her eser, Didem Kuzay tarafından özgün olarak
              üretilmiş tek kopya bir yağlıboya tablodur. Her eser, sanatçı imzalı özgünlük
              sertifikasıyla birlikte teslim edilir. Bu sertifika; eserin orijinal, tek parça ve
              başka kopyası bulunmadığını belgeler. Sertifikasız yapılan satışlarda garanti
              hükümleri geçerli değildir.
            </p>
          ),
        },
        {
          heading: "4. Garanti Kapsamı Dışı Durumlar",
          content: (
            <>
              <p>Aşağıdaki durumlar garanti kapsamı dışındadır:</p>
              <ul className="mt-2 flex flex-col gap-1 pl-4" style={{ listStyle: "disc" }}>
                <li>Alıcı kaynaklı fiziksel hasar (çizik, kırık, nem, doğrudan güneş hasarı)</li>
                <li>Eserin yüzeyine ya da çerçevesine yetkisiz müdahale</li>
                <li>Yanlış depolama veya asma koşullarından kaynaklanan bozulmalar</li>
                <li>Zaman içinde doğal renk değişimi (yağlıboya eserlerin doğal özelliği)</li>
              </ul>
            </>
          ),
        },
        {
          heading: "5. Bilgilendirme Hakkı",
          content: (
            <p>
              Alıcı, satın alacağı eserin teknik özellikleri (tuval boyutu, kullanılan boya,
              üretim yılı), sanatçı imzası ve sertifika bilgileri hakkında sipariş öncesinde
              ürün sayfasında açıkça bilgilendirilir. Ek bilgi talebi için her zaman iletişime
              geçilebilir.
            </p>
          ),
        },
        {
          heading: "6. Başvuru Kanalları",
          content: (
            <>
              <p>
                Şikayetleriniz ve talepleriniz için doğrudan KuzayArt ile iletişime geçebilirsiniz:
                <br />
                E-posta:{" "}
                <a href="mailto:info@kuzayart.com" style={{ color: "#c9a96e" }}>
                  info@kuzayart.com
                </a>
                <br />
                Telefon:{" "}
                <a href="tel:+905332760897" style={{ color: "#c9a96e" }}>
                  +90 533 276 08 97
                </a>
              </p>
              <p className="mt-3">
                Tüketici Hakem Heyeti başvurusu için{" "}
                <a
                  href="https://e-devlet.gov.tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#c9a96e" }}
                >
                  e-Devlet
                </a>{" "}
                üzerinden ikamet ettiğiniz yerdeki Tüketici Hakem Heyeti&apos;ne başvurabilirsiniz.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
