import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signToken, setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const rows = await sql`SELECT * FROM users WHERE email = ${email}` as Record<string, unknown>[];
  const user = rows[0];
  if (!user) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash as string);
  if (!valid) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  const token = await signToken({ id: user.id, name: user.name, email: user.email });
  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  });
  setSessionCookie(res, token);
  return res;
}
