import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { sql } from "@/lib/db";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    SELECT id, src, title, medium, dimensions, year,
           price, print_price, is_sold, show_in_hero, hero_order, created_at
    FROM paintings ORDER BY id ASC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { src, title, medium, dimensions, year, price, print_price, show_in_hero, hero_order } =
    await req.json();

  const rows = await sql`
    INSERT INTO paintings (src, title, medium, dimensions, year, price, print_price, show_in_hero, hero_order)
    VALUES (${src}, ${title}, ${medium ?? "Yağlı Boya"}, ${dimensions}, ${year},
            ${Number(price)}, ${Number(print_price)}, ${show_in_hero ?? true}, ${Number(hero_order ?? 0)})
    RETURNING *
  `;
  return NextResponse.json(rows[0]);
}
