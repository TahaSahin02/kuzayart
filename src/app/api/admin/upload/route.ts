import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/session";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext      = file.name.split(".").pop() ?? "jpg";
  const filename = `paintings/${Date.now()}.${ext}`;

  const blob = await put(filename, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
