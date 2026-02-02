// WeatherStats shows weather statistics in responsive cards
// It adapts automatically to mobile, tablet, and desktop screens

import StatCard from "./StatCard";

// Convert Celsius to Fahrenheit
function cToF(c) {
  return (c * 9) / 5 + 32;
}

export default function WeatherStats({ humidity, windMph, feelsLikeC, unit }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-0 mt-4">
      {/* 
        Responsive grid:
        - 1 column on mobile
        - 3 columns on tablet & desktop
      */}
      <div
        style={{ fontFamily: "var(--font-space)" }}
        className="
    grid
    grid-cols-1
    place-items-center
    md:grid-cols-3
    md:place-items-stretch
    gap-3
    md:gap-4
  "
      >
        {/* Humidity */}
        <StatCard
          title="Humidity"
          value={`${humidity}%`}
          subLabel="Cloud"
          iconSrc="/icons/PartlyCloudy.png"
        />

        {/* Wind */}
        <StatCard
          title="Wind"
          value={`${windMph} mph`}
          subLabel="Wind"
          iconSrc="/icons/wind.png"
        />

        {/* Feels Like */}
        <StatCard
          title="Feels Like"
          value={
            unit === "C"
              ? `${Math.round(feelsLikeC)}°C`
              : `${Math.round(cToF(feelsLikeC))}°F`
          }
          subLabel="Thermometer"
          iconSrc="/icons/temp.png"
        />
      </div>
    </section>
  );
}
