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
      currency VARCHAR(10) NOT NULL DEFAULT 'TRY',
      amount_eur_cents INTEGER,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      user_name VARCHAR(255),
      user_email VARCHAR(255),
      user_phone VARCHAR(30),
      user_address TEXT,
      user_city VARCHAR(100),
      user_postal_code VARCHAR(20),
      user_country VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  /* Add new columns to existing tables without losing data */
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_eur_cents INTEGER`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_city VARCHAR(100)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_postal_code VARCHAR(20)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_country VARCHAR(100)`;

  return NextResponse.json({ ok: true, message: "Veritabanı hazır." });
}
