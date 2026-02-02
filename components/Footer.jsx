export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full">
      <div
        style={{ fontFamily: "var(--font-space)" }}
        className="max-w-5xl mx-auto px-5 py-7 text-center text-xs text-slate-500"
      >
        © {year} Weather App. All rights reserved.
      </div>
    </footer>
  );
}
