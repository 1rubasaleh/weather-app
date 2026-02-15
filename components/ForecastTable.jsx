import Image from "next/image";

/* Format date string into weekday name */
function formatDayLabel(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

/* Convert Celsius to Fahrenheit */
function toF(c) {
  return (c * 9) / 5 + 32;
}

export default function ForecastTable({ days = [], unit }) {
  if (!Array.isArray(days) || days.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex justify-center">
      <div className="w-full max-w-[960px] mx-auto">
        {/* Header */}
        <div
          className="w-full flex items-center px-4 py-3"
          style={{ fontFamily: "Space Grotesk" }}
        >
          <p className="text-[#FFFFFF] font-bold text-[22px] w-full">
            5-Day Forecast
          </p>
        </div>

        {/* Table Container */}
        <div className="border border-[#384757] rounded-[12px] w-full overflow-hidden">
          {/* Desktop Header */}
          <div
            className="hidden md:grid md:grid-cols-[200px_220px_300px_1fr] px-6 h-[46px] items-center text-[14px] text-[#FFFFFF] bg-[#1C2129] border-b border-white"
            style={{ fontFamily: "var(--font-space)" }}
          >
            <span>Day</span>
            <span className="text-center">High / Low</span>
            <span className="text-center">Condition</span>
            <span className="justify-self-end"></span>
          </div>

          {/* Rows */}
          {days.map((d, idx) => {
            const high = typeof d.highC === "number" ? d.highC : 0;
            const low = typeof d.lowC === "number" ? d.lowC : 0;

            return (
              <div
                key={`${d.date}-${idx}`}
                className={`bg-[#0F1417] text-[#FFFFFF] ${
                  idx !== 0 ? "border-t border-white" : ""
                } px-4 py-3 md:px-6 md:py-0 rounded-md md:rounded-none`}
              >
                {/* Mobile Layout */}
                <div className="flex items-center justify-between md:hidden">
                  <div className="flex flex-col">
                    <span
                      className="text-sm font-medium"
                      style={{ fontFamily: "var(--font-space)" }}
                    >
                      {formatDayLabel(d.date)}
                    </span>
                    <span
                      className="text-sm mt-1"
                      style={{ fontFamily: "var(--font-space)" }}
                    >
                      {unit === "C"
                        ? `${Math.round(high)}°C / ${Math.round(low)}°C`
                        : `${Math.round(toF(high))}°F / ${Math.round(toF(low))}°F`}
                    </span>
                    <span
                      className="text-sm mt-1"
                      style={{ fontFamily: "var(--font-space)" }}
                    >
                      {d.conditionText || "-"}
                    </span>
                  </div>
                  {d.iconSrc && (
                    <Image
                      src={d.iconSrc}
                      alt=""
                      width={32} // متوسط على الموبايل
                      height={32}
                      style={{ display: "block" }}
                    />
                  )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:grid md:grid-cols-[200px_220px_300px_1fr] md:items-center md:h-[72px]">
                  <div
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    {formatDayLabel(d.date)}
                  </div>
                  <div
                    className="text-sm text-center"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    {unit === "C"
                      ? `${Math.round(high)}°C / ${Math.round(low)}°C`
                      : `${Math.round(toF(high))}°F / ${Math.round(toF(low))}°F`}
                  </div>
                  <div
                    className="text-sm text-center"
                    style={{ fontFamily: "var(--font-space)" }}
                  >
                    {d.conditionText || "-"}
                  </div>
                  <div className="flex justify-end items-center">
                    {d.iconSrc && (
                      <Image
                        src={d.iconSrc}
                        alt=""
                        width={24} // أصغر على الديسكتوب
                        height={24}
                        style={{ display: "block" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
