import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signToken, setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { name, email, password, phone } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Bu e-posta adresi zaten kayıtlı." },
      { status: 409 }
    );
  }

  const password_hash = await bcrypt.hash(password, 12);

  const inserted = await sql`
    INSERT INTO users (name, email, password_hash, phone)
    VALUES (${name}, ${email}, ${password_hash}, ${phone || null})
    RETURNING id, name, email
  ` as Record<string, unknown>[];
  const user = inserted[0];

  const token = await signToken({ id: user.id, name: user.name, email: user.email });
  const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  setSessionCookie(res, token);
  return res;
}
