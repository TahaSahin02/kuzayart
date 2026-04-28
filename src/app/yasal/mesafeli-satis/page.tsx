import LegalShell from "@/components/LegalShell";

export const metadata = { title: "Mesafeli Satış Sözleşmesi — KuzayArt" };

export default function MesafeliSatis() {
  return (
    <LegalShell
      title="Mesafeli Satış Sözleşmesi"
      sections={[
        {
          heading: "Madde 1 — Taraflar",
          content: (
            <>
              <p>
                <strong style={{ color: "#f0ece4" }}>1.1. Satıcı Bilgileri</strong>
                <br />
                Unvanı: KuzayArt / Didem Kuzay
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
                <strong style={{ color: "#f0ece4" }}>1.2. Alıcı Bilgileri</strong>
                <br />
                KuzayArt web sitesi üzerinden sipariş veren, fatura ve teslimat bilgileri sipariş
                formunda belirtilen gerçek ya da tüzel kişidir.
              </p>
            </>
          ),
        },
        {
          heading: "Madde 2 — Konu ve Kapsam",
          content: (
            <p>
              İşbu sözleşmenin konusu, Alıcı&apos;nın KuzayArt web sitesinden elektronik ortamda
              sipariş ettiği özgün yağlıboya tabloların satışı ve teslimatına ilişkin, 6502 sayılı
              Tüketicinin Korunması Hakkında Kanun ile Mesafeli Sözleşmeler Yönetmeliği hükümleri
              çerçevesinde tarafların hak ve yükümlülüklerinin belirlenmesidir.
            </p>
          ),
        },
        {
          heading: "Madde 3 — Ürün, Fiyat ve Ödeme",
          content: (
            <p>
              Eserlerin teknik nitelikleri (boyut, teknik, yıl, imza) ile tüm vergiler dahil satış
              bedeli web sitesinde her ürün sayfasında ayrıntılı biçimde belirtilmektedir. Tüm
              fiyatlar Avro (€) cinsindendir. Alıcı, sipariş onayı sırasında ürünün özelliklerini
              ve bedelini okuyup kabul ettiğini elektronik ortamda teyit eder. Ödemeler, PCI-DSS
              sertifikalı Stripe güvenli ödeme altyapısı üzerinden tahsil edilmektedir.
            </p>
          ),
        },
        {
          heading: "Madde 4 — Teslimat Şartları",
          content: (
            <p>
              Her eser, fiziksel hasarı önlemek amacıyla özel koruyucu köpük ve sert kasa
              ambalajla paketlenerek kargoya teslim edilir. Sipariş onayından kargoya teslime
              kadar geçen süre 3–7 iş günüdür. Yasal azami teslimat süresi sipariş
              onayından itibaren 30 gündür. Kargo takip numarası alıcının e-posta adresine
              bildirilir.
            </p>
          ),
        },
        {
          heading: "Madde 5 — Cayma Hakkı ve Koşulları",
          content: (
            <>
              <p>
                Alıcı, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi
                bir gerekçe göstermeksizin cayma hakkını kullanabilir.
              </p>
              <p className="mt-2">
                Cayma hakkının kullanılabilmesi için aşağıdaki koşulların tamamının sağlanması
                zorunludur:
              </p>
              <ul className="mt-2 flex flex-col gap-1 pl-4" style={{ listStyle: "disc" }}>
                <li>Eserin hasarsız, fiziksel olarak sağlam ve orijinal durumda olması</li>
                <li>
                  Beraberindeki sanatçı imzalı özgünlük sertifikasının eksiksiz iade edilmesi
                </li>
                <li>Orijinal ambalajında veya eşdeğer koruyucu ambalajda paketlenmesi</li>
              </ul>
              <p className="mt-2">
                İade kargo ücreti alıcıya aittir. Cayma bildirimi{" "}
                <a href="mailto:info@kuzayart.com" style={{ color: "#c9a96e" }}>
                  info@kuzayart.com
                </a>{" "}
                adresine yazılı olarak iletilmelidir.
              </p>
            </>
          ),
        },
        {
          heading: "Madde 6 — Özgünlük ve Telif",
          content: (
            <p>
              Satılan her eser, Didem Kuzay tarafından özgün olarak üretilmiş tek kopya bir
              yağlıboya tablodur ve imzalı özgünlük sertifikasıyla teslim edilir. Eserin fiziksel
              mülkiyeti alıcıya geçmekle birlikte tüm telif ve fikri mülkiyet hakları sanatçıya
              ait olmayı sürdürür.
            </p>
          ),
        },
        {
          heading: "Madde 7 — Uyuşmazlıkların Çözümü",
          content: (
            <p>
              İşbu sözleşmenin uygulanmasında çıkacak uyuşmazlıklarda, Ticaret Bakanlığınca her
              yıl ilan edilen parasal sınıra kadar Tüketici Hakem Heyetleri; bu sınırı aşan
              uyuşmazlıklarda ise yetkili Tüketici Mahkemeleri görevlidir.
            </p>
          ),
        },
      ]}
    />
  );
}
