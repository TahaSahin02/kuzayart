import LegalShell from "@/components/LegalShell";

export const metadata = { title: "Gizlilik Politikası — KuzayArt" };

export default function GizlilikPolitikasi() {
  return (
    <LegalShell
      title="Gizlilik ve Güvenlik Politikası"
      sections={[
        {
          heading: "1. Veri Sorumlusu",
          content: (
            <p>
              KuzayArt platformu, sanatçı Didem Kuzay tarafından işletilmektedir. 6698 sayılı
              Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu Didem
              Kuzay&apos;dır. Bu politika, sitemizdeki kişisel veri uygulamalarını şeffaf biçimde
              açıklamaktadır.
            </p>
          ),
        },
        {
          heading: "2. Toplanan Veriler ve İşlenme Amacı",
          content: (
            <>
              <p>
                Sipariş verdiğinizde, iletişim formu doldurduğunuzda veya bültene abone
                olduğunuzda aşağıdaki veriler toplanabilir:
              </p>
              <ul className="mt-2 flex flex-col gap-1 pl-4" style={{ listStyle: "disc" }}>
                <li>Ad, soyad</li>
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Teslimat ve fatura adresi</li>
              </ul>
              <p className="mt-3">
                Bu bilgiler yalnızca; siparişin işlenmesi, kargo takibi, yasal faturalandırma ve
                müşteri desteği amacıyla kullanılır. Pazarlama e-postaları için ayrıca açık
                rızanız alınır.
              </p>
            </>
          ),
        },
        {
          heading: "3. Verilerin Paylaşımı",
          content: (
            <p>
              Kişisel verileriniz hiçbir koşulda üçüncü taraf reklam ajanslarına, veri
              brokerlığı şirketlerine veya sosyal medya platformlarına satılmaz ya da kiralanmaz.
              Bilgileriniz yalnızca; teslimatın gerçekleştirilmesi için anlaşmalı kargo
              firmalarıyla ve yasal bir zorunluluk doğması halinde yetkili kamu kurumlarıyla
              paylaşılır.
            </p>
          ),
        },
        {
          heading: "4. Ödeme Güvenliği",
          content: (
            <p>
              KuzayArt, ödeme işlemleri için PCI-DSS sertifikalı Stripe altyapısını kullanmaktadır.
              Kredi kartı numarası, son kullanma tarihi ve CVV gibi finansal bilgileriniz
              sitemizin sunucularında kesinlikle saklanmaz. Tüm ödeme verileri SSL/TLS şifreleme
              ile doğrudan Stripe&apos;a iletilir.
            </p>
          ),
        },
        {
          heading: "5. Çerez (Cookie) Kullanımı",
          content: (
            <p>
              Sitemiz, alışveriş sepeti işlevselliği ve temel site fonksiyonları için zorunlu
              çerezler kullanmaktadır. Analitik amaçlı çerezler yalnızca onayınız alınarak
              etkinleştirilir. Çerez tercihlerinizi tarayıcı ayarlarınızdan dilediğiniz zaman
              değiştirebilirsiniz.
            </p>
          ),
        },
        {
          heading: "6. Haklarınız (KVKK Madde 11)",
          content: (
            <>
              <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="mt-2 flex flex-col gap-1 pl-4" style={{ listStyle: "disc" }}>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Verilerinize erişim ve kopyasını talep etme</li>
                <li>Eksik veya yanlış verilerin düzeltilmesini isteme</li>
                <li>Verilerinizin silinmesini talep etme</li>
                <li>Veri işlemeye itiraz etme</li>
              </ul>
              <p className="mt-3">
                Bu haklarınızı kullanmak için{" "}
                <a href="mailto:info@kuzayart.com" style={{ color: "#c9a96e" }}>
                  info@kuzayart.com
                </a>{" "}
                adresine yazabilirsiniz.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
