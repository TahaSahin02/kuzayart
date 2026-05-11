import { NextRequest } from "next/server";
import crypto from "crypto";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const merchant_oid = formData.get("merchant_oid") as string;
  const status = formData.get("status") as string;
  const total_amount = formData.get("total_amount") as string;
  const hash = formData.get("hash") as string;

  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
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
    await sql`
      UPDATE orders SET status = 'success', updated_at = NOW()
      WHERE merchant_oid = ${merchant_oid} AND status = 'pending'
    `;
  } else {
    await sql`
      UPDATE orders SET status = 'failed', updated_at = NOW()
      WHERE merchant_oid = ${merchant_oid}
    `;
  }

  // PayTR "OK" yanıtı bekler
  return new Response("OK");
}
