// ForecastTable displays 5-day forecast
// -------------------------------
// - Supports °C/°F conversion
// - Responsive layout: stacked on mobile, table on larger screens
// - Table header has border + border-radius covering the table
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
    <section className="w-full max-w-5xl mx-auto">
      {/* Section title with border on mobile */}
      <div
        style={{ fontFamily: "var(--font-space)" }}
        className=" text-white my-4 pt-5 px-4 pb-3 border-b border-gray-400 md:border-none rounded-t-xl"
      >
        <p className="w-232 h-7 font-space font-bold text-[22px] leading-7 tracking-normal opacity-100">
          5-Day Forecast
        </p>
      </div>

      {/* Table container with border + border-radius */}
      <div className="border border-[#384757] rounded-xl w-full max-w-[960px] overflow-hidden">
        {/* Table Header (only for medium screens and up) */}
        <div
          style={{ fontFamily: "var(--font-space)" }}
          className="hidden md:grid grid-cols-4 gap-8 px-3 py-4 text-xs text-slate-300 bg-[#1C2129] rounded-t-xl border-b border-gray-400 h-11.5 text-[14px]"
        >
          <span>Day</span>
          <span className="text-center">High / Low</span>
          <span className="text-center">Condition</span>
          <span className="justify-self-end"></span>
        </div>

        {/* Table Rows */}
        {days.map((d, idx) => (
          <div
            key={d.date}
            className={`flex flex-col md:grid md:grid-cols-4 md:gap-8 px-3 py-3.5 ${
              idx !== 0 ? "border-t border-gray-400" : ""
            }`}
          >
            {/* Day */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm text-slate-300 font-medium flex items-center md:justify-start justify-between"
            >
              {formatDayLabel(d.date)}
            </div>

            {/* High / Low */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm text-slate-300 flex items-center md:justify-center justify-between mt-1 md:mt-0"
            >
              {unit === "C"
                ? `${Math.round(d.highC)}°C / ${Math.round(d.lowC)}°C`
                : `${Math.round(toF(d.highC))}°F / ${Math.round(toF(d.lowC))}°F`}
            </div>

            {/* Condition */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm text-slate-400 flex items-center md:justify-center justify-between mt-1 md:mt-0"
            >
              {d.conditionText}
            </div>

            {/* Icon */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="flex justify-end items-center mt-1 md:mt-0"
            >
              <Image src={d.iconSrc} alt="" width={24} height={24} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
