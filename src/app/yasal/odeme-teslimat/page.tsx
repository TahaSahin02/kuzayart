import LegalShell from "@/components/LegalShell";

export const metadata = { title: "Ödeme & Teslimat — KuzayArt" };

export default function OdemeTeslimat() {
  return (
    <LegalShell
      title="Ödeme & Teslimat"
      sections={[
        {
          heading: "1. Ödeme Yöntemleri",
          content: (
            <p>
              Tüm ödemeler, PCI-DSS sertifikalı{" "}
              <strong style={{ color: "#f0ece4" }}>Stripe</strong> güvenli ödeme altyapısı
              üzerinden gerçekleştirilmektedir. Visa, Mastercard ve American Express ile ödeme
              yapılabilir. Kredi kartı bilgileriniz hiçbir şekilde KuzayArt sunucularında
              saklanmaz; SSL/TLS şifreleme ile doğrudan Stripe&apos;a iletilir.
            </p>
          ),
        },
        {
          heading: "2. Para Birimi ve Fiyatlandırma",
          content: (
            <p>
              Sitedeki tüm fiyatlar{" "}
              <strong style={{ color: "#f0ece4" }}>Avro (€)</strong> cinsinden belirtilmektedir.
              Ödeme anındaki döviz kuru bankanız tarafından uygulanır; bu konudaki kur farkından
              KuzayArt sorumlu tutulamaz. Fiyatlar KDV ve tüm vergiler dahil olup herhangi bir
              gizli ücret yoktur.
            </p>
          ),
        },
        {
          heading: "3. Ambalajlama",
          content: (
            <p>
              Her eser, nakliye sürecinde oluşabilecek fiziksel hasarı engellemek amacıyla özel
              koruyucu köpük katmanları ve dayanıklı dış ambalaj ile paketlenir. Ambalaj, eserin
              boyutuna göre özelleştirilir. Sanatçı imzalı özgünlük sertifikası ayrı bir kılıf
              içinde gönderi paketiyle birlikte teslim edilir.
            </p>
          ),
        },
        {
          heading: "4. Teslimat Süresi",
          content: (
            <>
              <ul className="flex flex-col gap-1 pl-4" style={{ listStyle: "disc" }}>
                <li>
                  Sipariş onayından kargoya teslime kadar geçen süre:{" "}
                  <strong style={{ color: "#f0ece4" }}>3–7 iş günü</strong>
                </li>
                <li>
                  Yasal azami teslimat süresi:{" "}
                  <strong style={{ color: "#f0ece4" }}>30 gün</strong>
                </li>
                <li>Kargo takip numarası sipariş e-posta adresine otomatik bildirilir</li>
              </ul>
            </>
          ),
        },
        {
          heading: "5. Kargo Ücreti",
          content: (
            <p>
              Kargo ücreti; eserin boyutu ve teslimat adresine göre değişiklik gösterir. Sipariş
              öncesi ödeme ekranında net kargo bedeli gösterilir, onaylama yapılmadan herhangi
              bir ücret tahsil edilmez.
            </p>
          ),
        },
        {
          heading: "6. Uluslararası Teslimat",
          content: (
            <p>
              Yurt dışına teslimat gerçekleştirilebilmektedir. Uluslararası gönderimlerde hedef
              ülkenin gümrük mevzuatına göre ek vergiler veya gümrük ücretleri söz konusu
              olabilir; bu masraflar alıcıya aittir. Teslimat süresi ülkeye bağlı olarak
              değişiklik gösterebilir; tahmini süre sipariş sırasında bildirilir.
            </p>
          ),
        },
        {
          heading: "İletişim",
          content: (
            <p>
              Ödeme veya teslimat hakkındaki tüm sorularınız için:
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
          ),
        },
      ]}
    />
  );
}
