//ForecastTable displays 5-day forecast, supports °C/°F conversion,
// and uses a responsive layout with a table header on large screens.
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
      <div className="uppercase  text-white  my-4 pt-5 p-4 pb-3">
        <p
          style={{ fontFamily: "var(--font-space)" }}
          className="   w-232
    h-7
    font-space
    font-bold
    text-[22px]
    leading-7
    tracking-normal
    opacity-100"
        >
          5-Day Forecast
        </p>
      </div>

      <div className="rounded-xl border border-[#384757] w-full max-w-[960px]">
        {/* Table Header */}
        <div
          style={{ fontFamily: "var(--font-space)" }}
          className="hidden md:grid grid-cols-4 gap-8 px-3 py-4 text-xs text-slate-300 bg-[#1C2129] rounded-t-lg border-b border-gray-400 h-11.5 text-[14px]"
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
            className={`grid grid-cols-1 md:grid-cols-4 md:gap-8 items-center px-3 py-3.5 h-[72px] ${
              idx !== 0 ? "border-t border-gray-400" : ""
            }`}
          >
            {/* Day */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm text-slate-300 font-medium flex items-center"
            >
              {formatDayLabel(d.date)}
            </div>

            {/* High / Low */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm text-slate-300 flex items-center justify-center"
            >
              {unit === "C"
                ? `${Math.round(d.highC)}°C / ${Math.round(d.lowC)}°C`
                : `${Math.round(toF(d.highC))}°F / ${Math.round(toF(d.lowC))}°F`}
            </div>

            {/* Condition */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm text-slate-400 flex items-center justify-center"
            >
              {d.conditionText}
            </div>

            {/* Icon */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="flex justify-end items-center"
            >
              <Image src={d.iconSrc} alt="" width={24} height={24} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
