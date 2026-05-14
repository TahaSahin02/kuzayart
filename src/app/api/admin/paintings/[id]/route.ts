import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { sql } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const rows = await sql`
    UPDATE paintings SET
      src         = COALESCE(${body.src         ?? null}, src),
      title       = COALESCE(${body.title       ?? null}, title),
      medium      = COALESCE(${body.medium      ?? null}, medium),
      dimensions  = COALESCE(${body.dimensions  ?? null}, dimensions),
      year        = COALESCE(${body.year        ?? null}, year),
      price       = COALESCE(${body.price       !== undefined ? Number(body.price)       : null}, price),
      print_price = COALESCE(${body.print_price !== undefined ? Number(body.print_price) : null}, print_price),
      is_sold     = COALESCE(${body.is_sold     !== undefined ? body.is_sold     : null}, is_sold),
      show_in_hero = COALESCE(${body.show_in_hero !== undefined ? body.show_in_hero : null}, show_in_hero),
      hero_order  = COALESCE(${body.hero_order  !== undefined ? Number(body.hero_order) : null}, hero_order)
    WHERE id = ${Number(id)}
    RETURNING *
  `;

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM paintings WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}
