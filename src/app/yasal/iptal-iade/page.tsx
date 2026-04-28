import LegalShell from "@/components/LegalShell";

export const metadata = { title: "İptal & İade — KuzayArt" };

export default function IptalIade() {
  return (
    <LegalShell
      title="İptal & İade Politikası"
      sections={[
        {
          heading: "1. İade Kabul Edilmemektedir",
          content: (
            <p>
              KuzayArt&apos;ta satışa sunulan tüm eserler, Didem Kuzay tarafından özgün olarak
              üretilmiş, tek kopya orijinal yağlıboya tablolardır. Her eser biricik ve
              tekrarlanamaz nitelikte olduğundan,{" "}
              <strong style={{ color: "#f0ece4" }}>
                satın alınan eserler için hiçbir koşulda iade veya cayma hakkı
                kabul edilmemektedir.
              </strong>{" "}
              Sipariş tamamlandıktan sonra iptal talebi de işleme alınmaz.
            </p>
          ),
        },
        {
          heading: "2. Satın Almadan Önce",
          content: (
            <p>
              Sipariş vermeden önce eserin boyutu, tekniği, renk tonu ve genel görünümü hakkında
              tüm detayları dikkatlice incelemenizi öneririz. Herhangi bir sorunuz veya görmek
              istediğiniz ek fotoğraf/video talebiniz varsa, sipariş öncesinde bizimle iletişime
              geçebilirsiniz:
              <br />
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
        {
          heading: "3. Kargo Hasarı",
          content: (
            <p>
              Eser, kargo sürecinde hasar görmüş olarak elinize ulaştıysa panik yapmayın — bu
              durumu çözmek için buradayız. Teslim tarihinden itibaren{" "}
              <strong style={{ color: "#f0ece4" }}>2 iş günü</strong> içinde hasarın
              fotoğraflı belgesiyle birlikte bizimle iletişime geçin. Duruma göre en uygun
              çözümü birlikte bulacağız.
              <br />
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
              <br />
              <br />
              2 iş günü geçtikten sonra yapılan kargo hasarı bildirimleri değerlendirmeye
              alınmayacaktır.
            </p>
          ),
        },
        {
          heading: "4. Yanlış veya Eksik Teslimat",
          content: (
            <p>
              Sipariş ettiğinizden farklı bir eser elinize ulaştıysa ya da özgünlük sertifikası
              eksikse, teslim tarihinden itibaren{" "}
              <strong style={{ color: "#f0ece4" }}>2 iş günü</strong> içinde fotoğraflı
              belgeyle birlikte iletişime geçin. Hata tarafımıza aitse gerekli düzeltmeyi
              sağlarız.
            </p>
          ),
        },
        {
          heading: "5. Diğer Konular",
          content: (
            <p>
              Aklınıza takılan ya da yukarıdaki başlıklara girmeyen herhangi bir konu için
              doğrudan bizimle iletişime geçin. Her sorunu ciddiye alır, dürüst ve hızlı bir
              yanıt veririz.
              <br />
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
