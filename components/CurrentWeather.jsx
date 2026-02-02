//CurrentWeather displays city, description, icon, and temperature
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
      <div className="flex flex-col items-center text-center max-w-xl gap-3">
        {/* City + Country */}
        <h2
          style={{ fontFamily: "var(--font-space)" }}
          className="text-2xl md:text-4xl font-semibold"
        >
          {city}, {country}
        </h2>

        {/* Description + Icon + Temp */}
        <div className="w-full max-w-5xl h-auto flex items-center gap-5 pt-1 pr-4 pb-3 pl-4">
          {/* Weather Icon */}
          <Image
            src={iconSrc}
            alt="Weather"
            width={32}
            height={32}
            className="shrink-0"
          />

          {/* Description + Temperature */}
          <div className="flex items-center gap-2">
            <p
              style={{ fontFamily: "var(--font-space)" }}
              className="font-space text-sm md:text-base leading-6 text-slate-300"
            >
              {description}
            </p>

            {/* Temperature + Unit */}
            {temp !== undefined && unit && (
              <span
                style={{ fontFamily: "var(--font-space)" }}
                className="font-space text-sm md:text-base leading-6 text-slate-300"
              >
                {Math.round(temp)}°{unit}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
