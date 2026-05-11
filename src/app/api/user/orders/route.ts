import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { sql } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await sql`
    SELECT id, merchant_oid, painting_titles, amount_cents, currency, status, created_at
    FROM orders
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;

  return NextResponse.json(orders);
}
