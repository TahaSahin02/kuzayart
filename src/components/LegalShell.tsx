import Link from "next/link";

interface Section {
  heading: string;
  content: React.ReactNode;
}

export default function LegalShell({
  title,
  sections,
}: {
  title: string;
  sections: Section[];
}) {
  return (
    <div
      style={{
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "24px",
        paddingRight: "24px",
        paddingTop: "130px",
        paddingBottom: "120px",
      }}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-colors duration-300 mb-10"
        style={{ color: "rgba(201,169,110,0.7)" }}
      >
        ← Ana Sayfa
      </Link>

      <h1
        className="font-light leading-tight"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          color: "#f0ece4",
          marginBottom: "40px",
          paddingBottom: "20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {title}
      </h1>

      <div className="flex flex-col gap-10">
        {sections.map((s) => (
          <div key={s.heading}>
            <h3
              className="font-light mb-3"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.25rem",
                color: "#c9a96e",
                letterSpacing: "0.04em",
              }}
            >
              {s.heading}
            </h3>
            <div
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {s.content}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-16 pt-8 text-xs"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        KuzayArt · Didem Kuzay · info@kuzayart.com · +90 533 276 08 97
      </div>
    </div>
  );
}
