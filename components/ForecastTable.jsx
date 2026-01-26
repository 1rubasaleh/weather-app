import Image from "next/image";
function formatDayLabel(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

function toF(c) {
  return (c * 9) / 5 + 32;
}

export default function ForecastTable({ days, unit }) {
  return (
    <section className="w-full max-w-5xl mx-auto ">
      <p className="text-xs uppercase tracking-[0.2em] text-white  my-4 pt-5 p-4 pb-3">
        5-Day Forecast
      </p>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 overflow-hidden">
        <div className="hidden md:grid grid-cols-4 px-3 py-4 text-xs text-slate-300 bg-slate-900 border-b border-gray-400">
          <span>Day</span>
          <span className="text-center">High / Low</span>
          <span>Condition</span>
          <span className="justify-self-end"></span>
        </div>

        {days.map((d, idx) => (
          <div
            key={d.date}
            className={`grid grid-cols-1 md:grid-cols-4 items-center px-3 py-3.5 ${
              idx !== 0 ? "border-t border-gray-400" : ""
            }`}
          >
            <div className="text-sm text-slate-300 font-medium">
              {formatDayLabel(d.date)}
            </div>

            <div className="text-sm text-slate-300 md:text-center">
              {unit === "C"
                ? `${Math.round(d.highC)}°C / ${Math.round(d.lowC)}°C`
                : `${Math.round(toF(d.highC))}°F / ${Math.round(toF(d.lowC))}°F`}
            </div>

            <div className="text-sm text-slate-400">{d.conditionText}</div>

            <div className="flex justify-start md:justify-end ">
              <Image src={d.iconSrc} alt="" width={24} height={24} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
