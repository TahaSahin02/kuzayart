import Header from "@/components/Header";

export default function YasalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        {children}
      </main>
    </>
  );
}
