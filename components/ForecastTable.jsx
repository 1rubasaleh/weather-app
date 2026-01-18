import Image from "next/image";

function formatDayLabel(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

export default function ForecastTable({ days }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white my-6">
        5-Day Forecast
      </p>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 overflow-hidden">
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-4 px-4 py-3 text-xs text-slate-300 bg-slate-900 border-b border-white/10">
          <span>Day</span>
          <span className="md:text-center">High / Low</span>
          <span>Condition</span>
          <span className="justify-self-end">Icon</span>
        </div>

        {/* Data Rows */}
        {days.map((d, idx) => (
          <div
            key={d.date}
            className={
              "grid grid-cols-1 md:grid-cols-4 items-center px-4 py-4 gap-2 md:gap-0 " +
              (idx !== 0 ? "border-t border-slate-800" : "")
            }
          >
            <div className="text-sm text-slate-300">
              {formatDayLabel(d.date)}
            </div>

            <div className="text-sm text-slate-300 md:text-center">
              {Math.round(d.highF)}°F / {Math.round(d.lowF)}°F
            </div>

            <div className="text-sm text-slate-400">{d.conditionText}</div>

            <div className="flex md:justify-end">
              <Image
                src={d.iconSrc}
                alt=""
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
