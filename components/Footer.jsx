export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full">
      <div className="max-w-5xl mx-auto px-5 py-10 text-center text-xs text-slate-500">
        © {year} Weather App. All rights reserved.
      </div>
    </footer>
  );
}
