import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`
    SELECT painting_ids FROM orders WHERE status = 'success'
  `;

  const soldIds = new Set<number>();
  for (const row of rows) {
    try {
      const ids = JSON.parse(row.painting_ids as string) as number[];
      ids.forEach((id) => soldIds.add(id));
    } catch {}
  }

  return NextResponse.json({ soldIds: Array.from(soldIds) });
}
