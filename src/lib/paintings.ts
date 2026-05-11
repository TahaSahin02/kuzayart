export interface Painting {
  id: number;
  src: string;
  title: string;
  medium: string;
  dimensions: string;
  year: string;
  price: number; // EUR
}

export const paintings: Painting[] = [
  {
    id: 1,
    src: "/paintings/tarama1.png",
    title: "Fırtınanın Eşiğinde",
    medium: "Yağlı Boya",
    dimensions: "100 × 70 cm",
    year: "2025",
    price: 1200,
  },
  {
    id: 2,
    src: "/paintings/tarama2.png",
    title: "Akdeniz Dalgası",
    medium: "Yağlı Boya",
    dimensions: "120 × 80 cm",
    year: "2025",
    price: 1800,
  },
  {
    id: 3,
    src: "/paintings/tarama3.png",
    title: "Gece Koyu",
    medium: "Yağlı Boya",
    dimensions: "90 × 70 cm",
    year: "2025",
    price: 950,
  },
  {
    id: 4,
    src: "/paintings/tarama4.png",
    title: "Altın Alacakaranlık",
    medium: "Yağlı Boya",
    dimensions: "80 × 60 cm",
    year: "2026",
    price: 750,
  },
];

export function formatPrice(n: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
