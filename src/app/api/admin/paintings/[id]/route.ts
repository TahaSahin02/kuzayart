import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { sql } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numId  = Number(id);
  const body   = await req.json() as Record<string, unknown>;

  // Apply each provided field as a separate UPDATE to avoid COALESCE boolean issues
  if (body.src         !== undefined) await sql`UPDATE paintings SET src         = ${String(body.src)}          WHERE id = ${numId}`;
  if (body.title       !== undefined) await sql`UPDATE paintings SET title       = ${String(body.title)}        WHERE id = ${numId}`;
  if (body.medium      !== undefined) await sql`UPDATE paintings SET medium      = ${String(body.medium)}       WHERE id = ${numId}`;
  if (body.dimensions  !== undefined) await sql`UPDATE paintings SET dimensions  = ${String(body.dimensions)}   WHERE id = ${numId}`;
  if (body.year        !== undefined) await sql`UPDATE paintings SET year        = ${String(body.year)}         WHERE id = ${numId}`;
  if (body.price       !== undefined) await sql`UPDATE paintings SET price       = ${Number(body.price)}        WHERE id = ${numId}`;
  if (body.print_price !== undefined) await sql`UPDATE paintings SET print_price = ${Number(body.print_price)}  WHERE id = ${numId}`;
  if (body.hero_order  !== undefined) await sql`UPDATE paintings SET hero_order  = ${Number(body.hero_order)}   WHERE id = ${numId}`;

  // Booleans: use SQL literal TRUE/FALSE to avoid Neon driver false→null issue
  if (body.is_sold !== undefined) {
    const val = body.is_sold === true || body.is_sold === "true";
    if (val) {
      await sql`UPDATE paintings SET is_sold = TRUE  WHERE id = ${numId}`;
    } else {
      await sql`UPDATE paintings SET is_sold = FALSE WHERE id = ${numId}`;
    }
  }
  if (body.show_in_hero !== undefined) {
    const val = body.show_in_hero === true || body.show_in_hero === "true";
    if (val) {
      await sql`UPDATE paintings SET show_in_hero = TRUE  WHERE id = ${numId}`;
    } else {
      await sql`UPDATE paintings SET show_in_hero = FALSE WHERE id = ${numId}`;
    }
  }

  const rows = await sql`SELECT * FROM paintings WHERE id = ${numId}`;
  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM paintings WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}
