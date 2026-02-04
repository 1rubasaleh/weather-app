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
        className="
          text-white
          my-4
          pt-5
          px-4 md:px-6
          pb-3
        "
      >
        <p className="font-bold text-[22px] leading-7">5-Day Forecast</p>
      </div>

      {/* Table container */}
      <div className="border border-[#384757] rounded-[12px] w-full px-4 md:px-0 md:max-w-[926px] mx-auto overflow-hidden">
        {/* Table Header (Desktop only) */}
        <div
          style={{ fontFamily: "var(--font-space)" }}
          className="
            hidden md:grid
            md:grid-cols-[200px_220px_300px_1fr]
            px-6
            h-[46px]
            items-center
            text-[14px]
            text-slate-300
            bg-[#1C2129]
            border-b border-gray-400
          "
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
            className={`
              flex flex-col
              md:grid md:grid-cols-[200px_220px_300px_1fr]
              md:h-[72px]
              md:items-center
              px-0 md:px-6
              py-3 md:py-0
              ${idx !== 0 ? "border-t border-gray-400" : ""}
            `}
          >
            {/* Day */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="
                text-sm
                text-slate-300
                font-medium
                flex justify-between
                md:justify-start
              "
            >
              {formatDayLabel(d.date)}
            </div>

            {/* High / Low */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="
                text-sm
                text-slate-300
                flex justify-between
                md:justify-center
              "
            >
              {unit === "C"
                ? `${Math.round(d.highC)}°C / ${Math.round(d.lowC)}°C`
                : `${Math.round(toF(d.highC))}°F / ${Math.round(toF(d.lowC))}°F`}
            </div>

            {/* Condition */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="
                text-sm
                text-slate-400
                flex justify-between
                md:justify-center
              "
            >
              {d.conditionText}
            </div>

            {/* Icon (hidden on mobile) */}
            <div className="hidden md:flex justify-end items-center">
              <Image src={d.iconSrc} alt="" width={24} height={24} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
