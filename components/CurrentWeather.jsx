// CurrentWeather
// Displays location, description, icon, and temperature
// Fully responsive

import Image from "next/image";
import { getIconSrc } from "@/lib/weatherIcons";

export default function CurrentWeather({ location, description, temp, unit }) {
  const iconSrc = getIconSrc(description);
  const displayTemp = unit === "C" ? temp : (temp * 9) / 5 + 32;

  return (
    <section className="w-full flex justify-center mt-4 px-4 text-white">
      <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-xl gap-3">
        {/* Location */}
        <h2
          style={{ fontFamily: "var(--font-space)" }}
          className="text-2xl md:text-4xl font-semibold"
        >
          {location || "Unknown location"}
        </h2>

        {/* Icon + Description + Temp */}
        <div className="flex items-center justify-center gap-3 md:justify-start">
          {/* Weather Icon */}
          <Image
            src={iconSrc}
            alt={description}
            width={52}
            height={52}
            priority
            className="shrink-0 w-8 h-8 md:w-12 md:h-12"
          />

          {/* Description */}
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-sm md:text-base text-slate-300 capitalize"
          >
            {description}
          </p>

          {/* Temperature */}
          <span
            style={{ fontFamily: "var(--font-space)" }}
            className="text-sm md:text-base text-slate-300"
          >
            {Math.round(displayTemp)}°{unit}
          </span>
        </div>
      </div>
    </section>
  );
}
