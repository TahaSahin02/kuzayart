import { Resend } from "resend";

const FROM        = "KuzayArt <noreply@kuzayart.com>";
const ADMIN_EMAIL = "info@encloseturkiye.com";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send");
    return null;
  }
  return new Resend(key);
}

export interface OrderEmailData {
  merchantOid:    string;
  customerName:   string;
  customerEmail:  string;
  customerPhone:  string | null;
  address:        string | null;
  city:           string | null;
  postalCode:     string | null;
  country:        string | null;
  paintingTitles: string;          // e.g. "Fırtınanın Eşiğinde, Akdeniz Dalgası (Baskı)"
  amountTRY:      number;          // in TRY (not cents)
  amountEUR:      number | null;   // in EUR (not cents), may be null
  createdAt:      Date;
}

/* ── Shared style helpers ── */
const wrap = (inner: string) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KuzayArt</title>
</head>
<body style="margin:0;padding:0;background:#f5f1ea;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f1ea;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5dfd2;">
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #e5dfd2;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:300;letter-spacing:8px;color:#1a1a1a;">KUZAYART</h1>
            </td>
          </tr>
          ${inner}
          <tr>
            <td style="padding:24px 40px;background:#1a1a1a;color:#a8a395;font-size:11px;letter-spacing:2px;text-align:center;">
              KUZAYART &nbsp;·&nbsp; www.kuzayart.com
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const row = (label: string, value: string) => `
<tr>
  <td style="padding:6px 0;font-size:12px;letter-spacing:1.5px;color:#888;text-transform:uppercase;width:40%;vertical-align:top;">${label}</td>
  <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${value}</td>
</tr>`;

/* ── Customer email ── */
function customerHtml(d: OrderEmailData): string {
  const inner = `
    <tr>
      <td style="padding:36px 40px 16px;">
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:300;color:#1a1a1a;">Siparişiniz alındı</h2>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#555;">
          Merhaba ${d.customerName}, KuzayArt'a hoş geldiniz. Siparişiniz başarıyla alınmıştır.
          Kargo süreci ile ilgili sizinle en kısa sürede iletişime geçeceğiz.
        </p>

        <div style="border:1px solid #e5dfd2;padding:20px 24px;margin-bottom:24px;background:#fafaf7;">
          <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;">Sipariş Bilgileri</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${row("Sipariş No",   d.merchantOid)}
            ${row("Tarih",        d.createdAt.toLocaleString("tr-TR"))}
            ${row("Eserler",      d.paintingTitles)}
            ${row("Toplam (TRY)", `₺${d.amountTRY.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)}
            ${d.amountEUR !== null ? row("Toplam (EUR)", `€${d.amountEUR.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) : ""}
          </table>
        </div>

        <div style="border:1px solid #e5dfd2;padding:20px 24px;margin-bottom:24px;background:#fafaf7;">
          <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;">Teslimat Bilgileri</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${row("Ad Soyad", d.customerName)}
            ${d.customerPhone ? row("Telefon", d.customerPhone) : ""}
            ${d.address       ? row("Adres",   d.address)       : ""}
            ${d.city          ? row("Şehir",   d.city)          : ""}
            ${d.postalCode    ? row("Posta Kodu", d.postalCode) : ""}
            ${d.country       ? row("Ülke",    d.country)       : ""}
          </table>
        </div>

        <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#555;">
          Sorularınız için bize <a href="mailto:info@encloseturkiye.com" style="color:#1a1a1a;text-decoration:underline;">info@encloseturkiye.com</a> adresinden ulaşabilirsiniz.
        </p>
        <p style="margin:24px 0 0;font-size:13px;color:#888;font-style:italic;">— KuzayArt</p>
      </td>
    </tr>`;
  return wrap(inner);
}

/* ── Admin email ── */
function adminHtml(d: OrderEmailData): string {
  const inner = `
    <tr>
      <td style="padding:36px 40px 16px;">
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:300;color:#1a1a1a;">Yeni Sipariş Geldi</h2>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#555;">
          <strong>${d.customerName}</strong> adlı müşteriden yeni bir sipariş alındı. Aşağıdaki bilgilere göre kargo süreci başlatılabilir.
        </p>

        <div style="border:1px solid #e5dfd2;padding:20px 24px;margin-bottom:24px;background:#fafaf7;">
          <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;">Sipariş</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${row("Sipariş No",   d.merchantOid)}
            ${row("Tarih",        d.createdAt.toLocaleString("tr-TR"))}
            ${row("Eserler",      d.paintingTitles)}
            ${row("Toplam (TRY)", `₺${d.amountTRY.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)}
            ${d.amountEUR !== null ? row("Toplam (EUR)", `€${d.amountEUR.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) : ""}
          </table>
        </div>

        <div style="border:1px solid #e5dfd2;padding:20px 24px;background:#fafaf7;">
          <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;">Müşteri</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${row("Ad Soyad",   d.customerName)}
            ${row("E-posta",    `<a href="mailto:${d.customerEmail}" style="color:#1a1a1a;">${d.customerEmail}</a>`)}
            ${d.customerPhone ? row("Telefon", `<a href="tel:${d.customerPhone}" style="color:#1a1a1a;">${d.customerPhone}</a>`) : ""}
            ${d.address       ? row("Adres",   d.address)       : ""}
            ${d.city          ? row("Şehir",   d.city)          : ""}
            ${d.postalCode    ? row("Posta Kodu", d.postalCode) : ""}
            ${d.country       ? row("Ülke",    d.country)       : ""}
          </table>
        </div>
      </td>
    </tr>`;
  return wrap(inner);
}

/* ── Sender ── */
export async function sendOrderEmails(data: OrderEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  try {
    await Promise.all([
      resend.emails.send({
        from:    FROM,
        to:      data.customerEmail,
        subject: `Siparişiniz alındı — ${data.merchantOid}`,
        html:    customerHtml(data),
      }),
      resend.emails.send({
        from:    FROM,
        to:      ADMIN_EMAIL,
        subject: `Yeni sipariş — ${data.customerName} (${data.merchantOid})`,
        html:    adminHtml(data),
        replyTo: data.customerEmail,
      }),
    ]);
  } catch (err) {
    // Never let email failures break the order flow.
    console.error("[email] send failed:", err);
  }
}
