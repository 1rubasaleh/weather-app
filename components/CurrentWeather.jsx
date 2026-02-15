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
          className="flex items-center justify-center gap-[18px] w-full px-4 py-2 flex-wrap"
          style={{
            maxWidth: "960px",
            height: "auto", // خلي الارتفاع تلقائي عشان يكبر حسب السطور
            paddingTop: "4px",
            paddingBottom: "12px",
          }}
        >
          {/* Weather Icon */}
          <Image
            src={iconSrc}
            alt={safeDescription}
            width={36}
            height={36}
            priority
            className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0"
          />

          {/* Description Sentence */}
          <p
            style={{ fontFamily: "Space Grotesk" }}
            className="text-white text-sm md:text-base font-normal leading-5 text-left break-words"
          >
            {weatherSentence}
          </p>
        </div>
      </div>
    </section>
  );
}
