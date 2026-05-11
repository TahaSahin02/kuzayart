import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      merchant_oid VARCHAR(100) UNIQUE NOT NULL,
      painting_ids TEXT NOT NULL,
      painting_titles TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      user_name VARCHAR(255),
      user_email VARCHAR(255),
      user_phone VARCHAR(20),
      user_address TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  return NextResponse.json({ ok: true, message: "Veritabanı hazır." });
}
