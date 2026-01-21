import StatCard from "./StatCard";
function cToF(c) {
  return (c * 9) / 5 + 32;
}

export default function WeatherStats({ humidity, windMph, feelsLikeC, unit }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <StatCard
          title="Humidity"
          value={`${humidity}%`}
          subLabel="Cloud"
          iconSrc="/icons/PartlyCloudy.png"
        />
        <StatCard
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
