import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/session";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Coerce many input shapes into a boolean.
 *  true / "true" / 1 / "1" / "on" / "yes"  → true
 *  everything else                          → false
 */
function toBool(v: unknown): boolean {
  if (v === true) return true;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    return s === "true" || s === "1" || s === "on" || s === "yes";
  }
  return false;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const numId  = Number(id);
  if (!Number.isFinite(numId) || numId <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await req.json()) as Record<string, unknown>;

  try {
    // ── String / number fields ──
    if (body.src         !== undefined) await sql`UPDATE paintings SET src         = ${String(body.src)}         WHERE id = ${numId}`;
    if (body.title       !== undefined) await sql`UPDATE paintings SET title       = ${String(body.title)}       WHERE id = ${numId}`;
    if (body.medium      !== undefined) await sql`UPDATE paintings SET medium      = ${String(body.medium)}      WHERE id = ${numId}`;
    if (body.dimensions  !== undefined) await sql`UPDATE paintings SET dimensions  = ${String(body.dimensions)}  WHERE id = ${numId}`;
    if (body.year        !== undefined) await sql`UPDATE paintings SET year        = ${String(body.year)}        WHERE id = ${numId}`;
    if (body.price       !== undefined) await sql`UPDATE paintings SET price       = ${Number(body.price)}       WHERE id = ${numId}`;
    if (body.print_price !== undefined) await sql`UPDATE paintings SET print_price = ${Number(body.print_price)} WHERE id = ${numId}`;
    if (body.hero_order  !== undefined) await sql`UPDATE paintings SET hero_order  = ${Number(body.hero_order)}  WHERE id = ${numId}`;

    // ── Booleans ──
    // Use SQL literal TRUE/FALSE (not query params) because the Neon serverless
    // driver can coerce JS `false` into NULL, leaving the column unchanged.
    if (body.is_sold !== undefined) {
      if (toBool(body.is_sold)) {
        await sql`UPDATE paintings SET is_sold = TRUE  WHERE id = ${numId}`;
      } else {
        await sql`UPDATE paintings SET is_sold = FALSE WHERE id = ${numId}`;
      }
    }
    if (body.show_in_hero !== undefined) {
      if (toBool(body.show_in_hero)) {
        await sql`UPDATE paintings SET show_in_hero = TRUE  WHERE id = ${numId}`;
      } else {
        await sql`UPDATE paintings SET show_in_hero = FALSE WHERE id = ${numId}`;
      }
    }

    const rows = await sql`SELECT * FROM paintings WHERE id = ${numId}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0], {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[PATCH /api/admin/paintings/:id] error:", err);
    return NextResponse.json(
      { error: "Update failed", detail: (err as Error)?.message ?? "unknown" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await sql`DELETE FROM paintings WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}
