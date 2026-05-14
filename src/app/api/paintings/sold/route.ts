import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Sold = admin marked as sold OR successfully ordered
    const marked  = await sql`SELECT id FROM paintings WHERE is_sold = true`;
    const ordered = await sql`SELECT painting_ids FROM orders WHERE status = 'success'`;

    const soldIds = new Set<number>(marked.map((r) => Number(r.id)));
    for (const row of ordered) {
      try {
        (JSON.parse(row.painting_ids as string) as number[]).forEach((id) => soldIds.add(id));
      } catch {}
    }
    return NextResponse.json({ soldIds: Array.from(soldIds) });
  } catch {
    return NextResponse.json({ soldIds: [] });
  }
}
