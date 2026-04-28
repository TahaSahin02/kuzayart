import LegalShell from "@/components/LegalShell";

export const metadata = { title: "İptal & İade — KuzayArt" };

export default function IptalIade() {
  return (
    <LegalShell
      title="İptal & İade Politikası"
      sections={[
        {
          heading: "1. Cayma Hakkı",
          content: (
            <p>
              Alıcı, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi bir
              gerekçe göstermeksizin cayma hakkını kullanabilir. Cayma bildirimi aşağıdaki
              iletişim kanallarından biri aracılığıyla KuzayArt&apos;a iletilmelidir:
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
          heading: "2. İade Koşulları",
          content: (
            <>
              <p>Cayma hakkı kapsamında iade edilecek eserin aşağıdaki koşulları sağlaması zorunludur:</p>
              <ul className="mt-2 flex flex-col gap-1 pl-4" style={{ listStyle: "disc" }}>
                <li>Eser fiziksel olarak hasarsız ve orijinal durumda olmalıdır</li>
                <li>
                  Beraberindeki sanatçı imzalı özgünlük sertifikası eksiksiz ve sağlam iade
                  edilmelidir
                </li>
                <li>
                  Eser, orijinal ambalajında veya aynı koruma düzeyini sağlayan eşdeğer bir
                  ambalajda gönderilmelidir
                </li>
              </ul>
              <p className="mt-3">
                Bu koşullardan herhangi biri sağlanmadığı takdirde KuzayArt iade talebini
                reddetme hakkını saklı tutar.
              </p>
            </>
          ),
        },
        {
          heading: "3. İade Edilemeyen Durumlar",
          content: (
            <>
              <p>Aşağıdaki durumlarda iade ve cayma hakkı kullanılamaz:</p>
              <ul className="mt-2 flex flex-col gap-1 pl-4" style={{ listStyle: "disc" }}>
                <li>Eserin alıcı kaynaklı fiziksel hasar görmesi (çizik, kırık, nem hasarı vb.)</li>
                <li>Özgünlük sertifikasının kaybolması veya tahrip edilmesi</li>
                <li>
                  Eserin herhangi bir şekilde restore edilmeye, çerçevelenmeye veya yüzeyine
                  müdahale edilmeye çalışılması
                </li>
                <li>14 günlük yasal cayma süresinin geçmiş olması</li>
              </ul>
            </>
          ),
        },
        {
          heading: "4. Nakliye Hasarı / Ayıplı Eser",
          content: (
            <p>
              Eser, web sitesinde belirtilen özelliklerden (boyut, teknik, imza) farklıysa veya
              kargo sürecinde hasar gördüyse, teslim tarihinden itibaren{" "}
              <strong style={{ color: "#f0ece4" }}>2 iş günü</strong> içinde fotoğraflı bildirim
              yapılması gerekmektedir. Bu durumlarda iade kargo ücreti KuzayArt tarafından
              karşılanır.
            </p>
          ),
        },
        {
          heading: "5. İade Kargo Ücreti",
          content: (
            <p>
              Cayma hakkı kapsamındaki iadelerde iade kargo ücreti alıcıya aittir. Ayıplı veya
              yanlış ürün teslimatlarında ise kargo masrafları KuzayArt tarafından üstlenilir.
            </p>
          ),
        },
        {
          heading: "6. Para İadesi",
          content: (
            <p>
              İade edilen eserin KuzayArt tarafından teslim alınmasının ardından, ürünün
              belirtilen koşullara uygunluğu incelenir. Onaylanan iadelerde ödeme tutarı, iade
              onay tarihinden itibaren en geç{" "}
              <strong style={{ color: "#f0ece4" }}>14 iş günü</strong> içinde orijinal ödeme
              yöntemiyle (Stripe üzerinden) iade edilir.
            </p>
          ),
        },
      ]}
    />
  );
}
