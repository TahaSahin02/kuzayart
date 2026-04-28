import LegalShell from "@/components/LegalShell";

export const metadata = { title: "Kullanım Şartları — KuzayArt" };

export default function KullanimSartlari() {
  return (
    <LegalShell
      title="Kullanım Şartları"
      sections={[
        {
          heading: "1. Kabul Beyanı",
          content: (
            <p>
              KuzayArt web sitesini ziyaret ederek, eserleri inceleyerek veya satın alma işlemi
              gerçekleştirerek aşağıdaki şartların tamamını okuduğunuzu, anladığınızı ve kabul
              ettiğinizi beyan etmiş sayılırsınız. Şartları kabul etmiyorsanız siteyi kullanmayı
              bırakmalısınız.
            </p>
          ),
        },
        {
          heading: "2. Fikri Mülkiyet Hakları",
          content: (
            <p>
              Sitede yer alan tüm yağlıboya tablo görselleri, sanat eseri fotoğrafları, sanatçı
              biyografisi, tasarım ögeleri, logolar, metinler ve sayfa düzenlerinin tüm fikri ve
              sınai mülkiyet hakları Didem Kuzay ve KuzayArt&apos;a aittir. Bu içerikler 5846 sayılı
              Fikir ve Sanat Eserleri Kanunu kapsamında koruma altındadır. Önceden yazılı izin
              alınmaksızın herhangi bir içeriğin kopyalanması, başka platformlarda yayınlanması,
              çoğaltılması veya ticari amaçla kullanılması kesinlikle yasaktır.
            </p>
          ),
        },
        {
          heading: "3. Eserlerin Kullanımı",
          content: (
            <p>
              Satın alınan özgün yağlıboya tablolar yalnızca kişisel kullanım, dekorasyon veya
              koleksiyon amacıyla edinilebilir. Eserin çoğaltılması, baskısının alınması, dijital
              ortamda ticari amaçla paylaşılması ya da türev eser oluşturulması, sanatçının yazılı
              onayı olmaksızın yasaktır. Fiziksel eserin mülkiyeti alıcıya geçse de telif ve fikri
              mülkiyet hakları Didem Kuzay&apos;a ait olmaya devam eder.
            </p>
          ),
        },
        {
          heading: "4. Kullanıcı Yükümlülükleri",
          content: (
            <p>
              Kullanıcı, siteyi kullanırken Türkiye Cumhuriyeti yasalarına, uluslararası telif
              hukukuna ve genel ahlak kurallarına uymayı kabul eder. Site sistemlerine aşırı yük
              bindiren bot yazılımları kullanmak, kaynak koduna yetkisiz erişim sağlamaya çalışmak
              veya tersine mühendislik yapmak yasaktır ve hukuki işlem gerektirebilir.
            </p>
          ),
        },
        {
          heading: "5. Değişiklik Hakkı",
          content: (
            <p>
              KuzayArt, sitede sunulan eserleri, fiyatları ve işbu kullanım şartlarını önceden
              haber vermeksizin güncelleme veya değiştirme hakkını saklı tutar. Değişiklikler
              sitede yayınlandığı andan itibaren geçerli sayılır.
            </p>
          ),
        },
        {
          heading: "İletişim",
          content: (
            <p>
              Kullanım şartlarına ilişkin sorularınız için:{" "}
              <a
                href="mailto:info@kuzayart.com"
                style={{ color: "#c9a96e" }}
              >
                info@kuzayart.com
              </a>{" "}
              veya{" "}
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
