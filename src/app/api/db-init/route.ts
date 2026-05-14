import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  // Users
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

  // Paintings (CMS managed)
  await sql`
    CREATE TABLE IF NOT EXISTS paintings (
      id SERIAL PRIMARY KEY,
      src TEXT NOT NULL,
      title VARCHAR(255) NOT NULL,
      medium VARCHAR(100) NOT NULL DEFAULT 'Yağlı Boya',
      dimensions VARCHAR(100) NOT NULL DEFAULT '',
      year VARCHAR(10) NOT NULL DEFAULT '',
      price INTEGER NOT NULL DEFAULT 0,
      print_price INTEGER NOT NULL DEFAULT 0,
      is_sold BOOLEAN NOT NULL DEFAULT FALSE,
      show_in_hero BOOLEAN NOT NULL DEFAULT TRUE,
      hero_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Seed existing 4 paintings (won't duplicate)
  await sql`
    INSERT INTO paintings (id, src, title, medium, dimensions, year, price, print_price, is_sold, show_in_hero, hero_order)
    VALUES
      (1, '/paintings/tarama1.png', 'Fırtınanın Eşiğinde', 'Yağlı Boya', '100 × 70 cm', '2025', 1200, 150, false, true, 0),
      (2, '/paintings/tarama2.png', 'Akdeniz Dalgası',     'Yağlı Boya', '120 × 80 cm', '2025', 1800, 200, false, true, 1),
      (3, '/paintings/tarama3.png', 'Gece Koyu',           'Yağlı Boya', '90 × 70 cm',  '2025',  950, 120, false, true, 2),
      (4, '/paintings/tarama4.png', 'Altın Alacakaranlık', 'Yağlı Boya', '80 × 60 cm',  '2026',  750, 100, false, true, 3)
    ON CONFLICT (id) DO NOTHING
  `;
  // Advance sequence past seeded rows
  await sql`SELECT setval('paintings_id_seq', GREATEST((SELECT MAX(id) FROM paintings), 4))`;

  // Orders
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
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_eur_cents INTEGER`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_city VARCHAR(100)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_postal_code VARCHAR(20)`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_country VARCHAR(100)`;

  return NextResponse.json({ ok: true, message: "Veritabanı hazır." });
}
