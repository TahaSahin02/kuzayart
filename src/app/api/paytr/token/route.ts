import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { paintings } from "@/lib/paintings";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { paintingIds, address, phone } = await req.json() as {
    paintingIds: number[];
    address: string;
    phone: string;
  };

  const selected = paintings.filter((p) => paintingIds.includes(p.id));
  if (selected.length === 0) {
    return NextResponse.json({ error: "Geçersiz ürün." }, { status: 400 });
  }

  const merchant_id = process.env.PAYTR_MERCHANT_ID!;
  const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;

  const merchant_oid = `KA${Date.now()}`;
  const totalCents = selected.reduce((s, p) => s + p.price * 100, 0);
  const currency = "EUR";
  const no_installment = "1";
  const max_installment = "0";
  const test_mode = process.env.PAYTR_TEST_MODE ?? "0";

  const basketArr = selected.map((p) => [p.title, p.price.toFixed(2), 1]);
  const user_basket = Buffer.from(JSON.stringify(basketArr)).toString("base64");

  const userIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const hashStr = `${merchant_id}${userIp}${merchant_oid}${user.email}${totalCents}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
  const paytr_token = crypto
    .createHmac("sha256", merchant_key)
    .update(hashStr + merchant_salt)
    .digest("base64");

  const body = new URLSearchParams({
    merchant_id,
    merchant_key,
    merchant_salt,
    email: user.email,
    payment_amount: String(totalCents),
    merchant_oid,
    user_name: user.name,
    user_address: address,
    user_phone: phone,
    merchant_ok_url: `${base_url}/odeme/basarili`,
    merchant_fail_url: `${base_url}/odeme/hata`,
    user_basket,
    user_ip: userIp,
    timeout_limit: "30",
    debug_on: "1",
    test_mode,
    lang: "tr",
    no_installment,
    max_installment,
    currency,
    paytr_token,
  });

  // Siparişi DB'ye kaydet
  await sql`
    INSERT INTO orders (
      user_id, merchant_oid, painting_ids, painting_titles,
      amount_cents, currency, status,
      user_name, user_email, user_phone, user_address
    ) VALUES (
      ${user.id}, ${merchant_oid},
      ${JSON.stringify(selected.map((p) => p.id))},
      ${selected.map((p) => p.title).join(", ")},
      ${totalCents}, ${currency}, 'pending',
      ${user.name}, ${user.email}, ${phone}, ${address}
    )
    ON CONFLICT (merchant_oid) DO NOTHING
  `;

  const resp = await fetch("https://www.paytr.com/odeme/api/get-token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await resp.json()) as { status: string; token?: string; reason?: string };

  if (data.status !== "success") {
    return NextResponse.json(
      { error: data.reason ?? "PayTR token alınamadı." },
      { status: 400 }
    );
  }

  return NextResponse.json({ iframeToken: data.token, merchantOid: merchant_oid });
}
