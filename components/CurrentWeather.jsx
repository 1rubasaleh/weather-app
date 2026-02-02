// CurrentWeather displays city, description, icon, and temperature
// Fully responsive for mobile, tablet, and desktop

import Image from "next/image";
import { getIconSrc } from "@/lib/weatherIcons";

export default function CurrentWeather({
  city,
  country,
  description,
  temp,
  unit,
}) {
  const iconSrc = getIconSrc(description);

  return (
    <section className="w-full flex justify-center mt-4 px-4 text-white">
      <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-xl gap-3">
        {/* City + Country */}
        <h2
          style={{ fontFamily: "var(--font-space)" }}
          className="text-2xl md:text-4xl font-semibold"
        >
          {city}, {country}
        </h2>

        {/* Icon + Description + Temp */}
        <div className="w-full flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-3 md:pl-1">
          {/* Weather Icon */}
          <Image
            src={iconSrc}
            alt="Weather"
            width={52}
            height={52}
            priority
            className="shrink-0 md:mr-4"
          />

          {/* Description + Temperature (same line) */}
          <div className="flex items-center gap-2">
            <p
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm md:text-base text-slate-300"
            >
              {description}
            </p>

            <span
              style={{ fontFamily: "var(--font-space)" }}
              className="text-sm md:text-base text-slate-300"
            >
              {Math.round(temp)}°{unit}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
