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
      {/* Section title */}
      <div
        style={{ fontFamily: "var(--font-space)" }}
        className="text-white my-4 pt-5 px-4 pb-3 md:border-b md:border-gray-400 md:border-none rounded-t-xl"
      >
        <p className="font-space font-bold text-lg md:text-[22px] leading-7">
          5-Day Forecast
        </p>
      </div>

      {/* Table container */}
      <div className="border border-[#384757] rounded-xl w-full max-w-[90%] md:max-w-[960px] mx-auto overflow-hidden">
        {/* Table Header */}
        <div
          style={{ fontFamily: "var(--font-space)" }}
          className="hidden md:grid grid-cols-4 gap-8 px-3 py-4 text-xs text-slate-300 bg-[#1C2129] rounded-t-xl border-b border-gray-400"
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
            className={`flex flex-col md:grid md:grid-cols-4 md:gap-8 px-3 py-3 ${
              idx !== 0 ? "border-t border-gray-400" : ""
            }`}
          >
            {/* Day */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-xs md:text-sm text-slate-300 font-medium flex justify-between md:justify-start"
            >
              {formatDayLabel(d.date)}
            </div>

            {/* High / Low */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-xs md:text-sm text-slate-300 flex justify-between md:justify-center mt-1 md:mt-0"
            >
              {unit === "C"
                ? `${Math.round(d.highC)}°C / ${Math.round(d.lowC)}°C`
                : `${Math.round(toF(d.highC))}°F / ${Math.round(toF(d.lowC))}°F`}
            </div>

            {/* Condition */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-xs md:text-sm text-slate-400 flex justify-between md:justify-center mt-1 md:mt-0"
            >
              {d.conditionText}
            </div>

            {/* Icon */}
            <div className="flex justify-end items-center mt-1 md:mt-0">
              <Image src={d.iconSrc} alt="" width={20} height={20} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
