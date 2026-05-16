import { NextRequest } from "next/server";
import crypto from "crypto";
import { sql } from "@/lib/db";
import { sendOrderEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const merchant_oid = formData.get("merchant_oid") as string;
  const status       = formData.get("status") as string;
  const total_amount = formData.get("total_amount") as string;
  const hash         = formData.get("hash") as string;

  const merchant_key  = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;

  // Hash doğrulama — PayTR'ın gönderdiğini teyit et
  const expected = crypto
    .createHmac("sha256", merchant_key)
    .update(merchant_oid + merchant_salt + status + total_amount)
    .digest("base64");

  if (hash !== expected) {
    console.error("PayTR: geçersiz hash");
    return new Response("INVALID_HASH", { status: 400 });
  }

  if (status === "success") {
    // Only flip from 'pending' → 'success' once (PayTR may retry the callback)
    const updated = await sql`
      UPDATE orders
      SET status = 'success', updated_at = NOW()
      WHERE merchant_oid = ${merchant_oid} AND status = 'pending'
      RETURNING
        merchant_oid, painting_titles,
        amount_cents, amount_eur_cents, currency,
        user_name, user_email, user_phone,
        user_address, user_city, user_postal_code, user_country,
        created_at
    `;

    // Send confirmation emails exactly once — only if this callback was the
    // one that actually transitioned the order to 'success'.
    if (updated.length > 0) {
      const o = updated[0] as Record<string, unknown>;
      await sendOrderEmails({
        merchantOid:    String(o.merchant_oid),
        customerName:   String(o.user_name ?? ""),
        customerEmail:  String(o.user_email ?? ""),
        customerPhone:  (o.user_phone as string | null) ?? null,
        address:        (o.user_address as string | null) ?? null,
        city:           (o.user_city as string | null) ?? null,
        postalCode:     (o.user_postal_code as string | null) ?? null,
        country:        (o.user_country as string | null) ?? null,
        paintingTitles: String(o.painting_titles ?? ""),
        amountTRY:      Number(o.amount_cents ?? 0) / 100,
        amountEUR:      o.amount_eur_cents != null ? Number(o.amount_eur_cents) / 100 : null,
        createdAt:      new Date(String(o.created_at)),
      });
    }
  } else {
    await sql`
      UPDATE orders SET status = 'failed', updated_at = NOW()
      WHERE merchant_oid = ${merchant_oid}
    `;
  }

  // PayTR "OK" yanıtı bekler
  return new Response("OK");
}
