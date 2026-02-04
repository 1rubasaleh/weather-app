// WeatherStats shows weather statistics in responsive cards
// Matches table width and custom mobile layout

import StatCard from "./StatCard";

// Convert Celsius to Fahrenheit
function cToF(c) {
  return (c * 9) / 5 + 32;
}

export default function WeatherStats({ humidity, windMph, feelsLikeC, unit }) {
  return (
    <section className="w-full flex justify-center mt-4">
      {/* Wrapper same as table */}
      <div className="w-full md:max-w-[960px] px-4">
        <div
          style={{ fontFamily: "var(--font-space)" }}
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-3
            md:gap-4
            place-items-stretch
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
          <div className="col-span-2 md:col-span-1 flex justify-center">
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
        </div>
      </div>
    </section>
  );
}
