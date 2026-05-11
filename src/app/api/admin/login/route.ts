import { NextRequest, NextResponse } from "next/server";
import { signToken, setAdminCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Yanlış şifre." }, { status: 401 });
  }

  const token = await signToken({ role: "admin" });
  const res = NextResponse.json({ ok: true });
  setAdminCookie(res, token);
  return res;
}
