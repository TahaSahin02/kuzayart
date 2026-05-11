import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { sql } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await sql`
    SELECT
      o.id, o.merchant_oid, o.painting_titles, o.amount_cents, o.currency,
      o.status, o.user_name, o.user_email, o.user_phone, o.user_address, o.created_at
    FROM orders o
    ORDER BY o.created_at DESC
  `;

  const customers = await sql`
    SELECT id, name, email, phone, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  const revRows = await sql`
    SELECT COALESCE(SUM(amount_cents), 0) AS total FROM orders WHERE status = 'success'
  `;
  const rev = (revRows as Record<string, unknown>[])[0];

  return NextResponse.json({
    orders,
    customers,
    totalRevenueCents: Number(rev?.total ?? 0),
  });
}
