import Image from "next/image";
import { getIconSrc } from "@/lib/weatherIcons";

export default function CurrentWeather({ location, description, temp, unit }) {
  const safeDescription = description || "Clear";
  const iconSrc = getIconSrc(safeDescription);

  const displayTemp = unit === "C" ? temp : Math.round((temp * 9) / 5 + 32);

  const weatherSentence = `${safeDescription} with a high of ${displayTemp}°${unit}`;

  return (
    <section className="w-full flex justify-center mt-4 px-4">
      <div className="flex flex-col items-center gap-3 w-full max-w-xl">
        {/* Location */}
        <h2
          style={{ fontFamily: "var(--font-space)" }}
          className="text-2xl md:text-4xl font-semibold text-white text-center"
        >
          {location || "Unknown location"}
        </h2>

        {/* Icon + Description Sentence Container */}
        <div
          className="flex items-center justify-center gap-[21px] w-full px-4 py-2"
          style={{
            maxWidth: "960px",
            height: "68px",
            paddingTop: "4px",
            paddingBottom: "12px",
          }}
        >
          {/* Weather Icon */}
          <Image
            src={iconSrc}
            alt={safeDescription}
            width={36} // أصغر على الموبايل
            height={36}
            priority
            className="w-9 h-9 md:w-12 md:h-12"
          />

          {/* Description Sentence */}
          <p
            style={{ fontFamily: "Space Grotesk" }}
            className="text-white text-sm md:text-base font-normal leading-6 text-left truncate"
          >
            {weatherSentence}
          </p>
        </div>
      </div>
    </section>
  );
}
