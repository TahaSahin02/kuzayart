import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Never cache — always fetch fresh from DB so admin changes reflect immediately
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, src, title, medium, dimensions, year,
             price, print_price, is_sold, show_in_hero, hero_order
      FROM paintings
      ORDER BY id ASC
    `;
    return NextResponse.json(rows, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (err) {
    console.error("[/api/paintings] DB error, using fallback:", err);
    // Table doesn't exist yet — return static fallback
    return NextResponse.json(
      [
        { id: 1, src: "/paintings/tarama1.png", title: "Fırtınanın Eşiğinde", medium: "Yağlı Boya", dimensions: "100 × 70 cm", year: "2025", price: 1200, print_price: 150, is_sold: false, show_in_hero: true, hero_order: 0 },
        { id: 2, src: "/paintings/tarama2.png", title: "Akdeniz Dalgası",     medium: "Yağlı Boya", dimensions: "120 × 80 cm", year: "2025", price: 1800, print_price: 200, is_sold: false, show_in_hero: true, hero_order: 1 },
        { id: 3, src: "/paintings/tarama3.png", title: "Gece Koyu",           medium: "Yağlı Boya", dimensions: "90 × 70 cm",  year: "2025", price:  950, print_price: 120, is_sold: false, show_in_hero: true, hero_order: 2 },
        { id: 4, src: "/paintings/tarama4.png", title: "Altın Alacakaranlık", medium: "Yağlı Boya", dimensions: "80 × 60 cm",  year: "2026", price:  750, print_price: 100, is_sold: false, show_in_hero: true, hero_order: 3 },
      ],
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
