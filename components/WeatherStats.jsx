//WeatherStats shows stats with unit conversion and responsive layout.
import StatCard from "./StatCard";
function cToF(c) {
  return (c * 9) / 5 + 32;
}

export default function WeatherStats({ humidity, windMph, feelsLikeC, unit }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-3">
      <div
        style={{ fontFamily: "var(--font-space)" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
      >
        <StatCard
          className="font-space font-medium text-base leading-6 tracking-normal"
          title="Humidity"
          value={`${humidity}%`}
          subLabel="Cloud"
          iconSrc="/icons/PartlyCloudy.png"
        />
        <StatCard
          className="font-space font-bold text-2xl leading-1.87 tracking-normal"
          title="Wind"
          value={`${windMph} mph`}
          subLabel="Wind"
          iconSrc="/icons/wind.png"
        />
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
