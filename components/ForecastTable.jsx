// ForecastTable displays 5-day forecast
// -----------------------------------
// - Supports °C/°F conversion
// - Responsive layout
// - Mobile & Tablet: icons visible with continuous animation
// - Desktop: matches Figma exactly

import Image from "next/image";
import { motion } from "framer-motion";

function formatDayLabel(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

function toF(c) {
  return (c * 9) / 5 + 32;
}

/* Continuous floating animation for icons */
const iconMotion = {
  animate: {
    y: [0, -6, 0], // تحرك للأعلى والأسفل
    transition: {
      duration: 1.8,
      ease: "easeInOut",
      repeat: Infinity, // مستمر
    },
  },
};

export default function ForecastTable({ days, unit }) {
  return (
    <section className="w-full max-w-5xl mx-auto">
      {/* Section title */}
      <div
        style={{ fontFamily: "var(--font-space)" }}
        className="text-white my-4 pt-5 px-6 pb-3"
      >
        <p className="font-bold text-[22px] leading-7">5-Day Forecast</p>
      </div>

      {/* Table container */}
      <div className="border border-[#384757] rounded-[12px] w-full md:max-w-[926px] mx-auto overflow-hidden">
        {/* Table Header (Desktop only) */}
        <div
          style={{ fontFamily: "var(--font-space)" }}
          className="hidden md:grid md:grid-cols-[200px_220px_300px_1fr]
                     px-6 h-[46px] items-center text-[14px]
                     text-slate-300 bg-[#1C2129]
                     border-b border-gray-400"
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
              flex flex-col gap-2
              md:grid md:grid-cols-[200px_220px_300px_1fr]
              md:h-[72px] md:items-center
              px-6 py-4 md:py-0
              ${idx !== 0 ? "border-t border-gray-400" : ""}
            `}
          >
            {/* Day */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm text-slate-300 font-medium"
            >
              {formatDayLabel(d.date)}
            </div>

            {/* High / Low */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm text-slate-300 md:text-center"
            >
              {unit === "C"
                ? `${Math.round(d.highC)}°C / ${Math.round(d.lowC)}°C`
                : `${Math.round(toF(d.highC))}°F / ${Math.round(toF(d.lowC))}°F`}
            </div>

            {/* Condition + Icon (mobile & tablet) */}
            <div
              style={{ fontFamily: "var(--font-space)" }}
              className="flex items-center justify-between gap-3
                         text-sm text-slate-400
                         md:justify-center"
            >
              <span>{d.conditionText}</span>

              {/* Icon for mobile & tablet */}
              <motion.div {...iconMotion} className="md:hidden flex-shrink-0">
                <Image src={d.iconSrc} alt="" width={28} height={28} />
              </motion.div>
            </div>

            {/* Icon (desktop only – original position) */}
            <div className="hidden md:flex justify-end items-center">
              <motion.div {...iconMotion}>
                <Image src={d.iconSrc} alt="" width={24} height={24} />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
