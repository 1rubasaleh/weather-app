// Footer Component
// ----------------
// - Displays copyright info
// - Fully responsive: adjusts padding and font size based on screen size
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-[#0F1417]">
      <div
        style={{ fontFamily: "var(--font-space)" }}
        className="max-w-5xl mx-auto px-5 py-5 md:py-7 text-center text-xs md:text-sm text-slate-500"
      >
        © {year} Weather App. All rights reserved.
      </div>
    </footer>
  );
}
