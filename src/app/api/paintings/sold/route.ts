import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Kept for backwards compatibility, but truth lives in paintings.is_sold (admin-controlled).
// Orders no longer auto-flip is_sold — only the admin SATIŞTA/SATILDI toggle does.
export const dynamic  = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const rows = await sql`SELECT id FROM paintings WHERE is_sold = TRUE`;
    return NextResponse.json(
      { soldIds: rows.map((r) => Number(r.id)) },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch {
    return NextResponse.json({ soldIds: [] }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
