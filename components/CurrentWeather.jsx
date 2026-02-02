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
      <div className="flex flex-col items-start text-left max-w-xl gap-3">
        {/* City + Country */}
        <h2
          style={{ fontFamily: "var(--font-space)" }}
          className="text-2xl md:text-4xl font-semibold"
        >
          {city}, {country}
        </h2>

        {/* Description + Icon + Temp */}
        <div className="w-full flex items-center gap-3 pl-1">
          {/* Weather Icon */}
          <Image
            src={iconSrc}
            alt="Weather"
            width={52}
            height={52}
            priority
            className="shrink-0 mr-4"
          />

          {/* Description + Temperature */}
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
