import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";
import { paintings } from "@/lib/paintings";

async function fetchEurToTry(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/EUR", {
      next: { revalidate: 1800 },
    });
    const data = await res.json();
    if (data?.result === "success" && typeof data?.rates?.TRY === "number") {
      return data.rates.TRY;
    }
  } catch {}
  return 55.0;
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const {
    items,           // { id: number; type: "original" | "print" }[]
    fullName,
    phone,           // includes country code, e.g. "+90 5XX XXX XX XX"
    address,
    city,
    postalCode,
    country,
  } = await req.json() as {
    items: { id: number; type: "original" | "print" }[];
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Geçersiz ürün." }, { status: 400 });
  }

  // Resolve each item to its correct EUR price from our database
  const resolvedItems = items.flatMap(({ id, type }) => {
    const p = paintings.find((x) => x.id === id);
    if (!p) return [];
    return [{ painting: p, type, priceEur: type === "original" ? p.price : p.printPrice }];
  });

  if (resolvedItems.length === 0) {
    return NextResponse.json({ error: "Geçersiz ürün." }, { status: 400 });
  }

  const merchant_id   = process.env.PAYTR_MERCHANT_ID!;
  const merchant_key  = process.env.PAYTR_MERCHANT_KEY!;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
  const base_url      = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.kuzayart.com";

  const merchant_oid = `KA${Date.now()}`;

  const eurToTry    = await fetchEurToTry();
  const totalEUR    = resolvedItems.reduce((s, i) => s + i.priceEur, 0);
  const totalTRY    = totalEUR * eurToTry;
  const paymentCents = Math.round(totalTRY * 100); // kuruş

  const currency       = "TRY";
  const no_installment = "1";
  const max_installment = "0";
  const test_mode      = process.env.PAYTR_TEST_MODE ?? "0";

  const basketArr = resolvedItems.map((i) => [
    `${i.painting.title}${i.type === "print" ? " (Baskı)" : ""}`,
    (i.priceEur * eurToTry).toFixed(2),
    1,
  ]);
  const user_basket = Buffer.from(JSON.stringify(basketArr)).toString("base64");

  const userIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const hashStr = `${merchant_id}${userIp}${merchant_oid}${user.email}${paymentCents}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
  const paytr_token = crypto
    .createHmac("sha256", merchant_key)
    .update(hashStr + merchant_salt)
    .digest("base64");

  // Full address for PayTR and DB
  const fullAddress = `${address}, ${city} ${postalCode}, ${country}`;

  const body = new URLSearchParams({
    merchant_id,
    merchant_key,
    merchant_salt,
    email: user.email,
    payment_amount: String(paymentCents),
    merchant_oid,
    user_name: fullName,
    user_address: fullAddress,
    user_phone: phone,
    merchant_ok_url:   `${base_url}/odeme/basarili`,
    merchant_fail_url: `${base_url}/odeme/hata`,
    user_basket,
    user_ip:          userIp,
    timeout_limit:    "30",
    debug_on:         "1",
    test_mode,
    lang:             "tr",
    no_installment,
    max_installment,
    currency,
    paytr_token,
  });

  // Save pending order with all address fields
  await sql`
    INSERT INTO orders (
      user_id, merchant_oid, painting_ids, painting_titles,
      amount_cents, amount_eur_cents, currency, status,
      user_name, user_email, user_phone, user_address,
      user_city, user_postal_code, user_country
    ) VALUES (
      ${user.id}, ${merchant_oid},
      ${JSON.stringify(resolvedItems.map((i) => i.painting.id))},
      ${resolvedItems.map((i) => `${i.painting.title}${i.type === "print" ? " (Baskı)" : ""}`).join(", ")},
      ${paymentCents}, ${Math.round(totalEUR * 100)}, ${currency}, 'pending',
      ${fullName}, ${user.email}, ${phone}, ${fullAddress},
      ${city}, ${postalCode}, ${country}
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

  return NextResponse.json({
    iframeToken: data.token,
    merchantOid: merchant_oid,
    eurToTry,
    totalEUR,
  });
}
