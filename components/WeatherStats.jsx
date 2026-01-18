import StatCard from "./StatCard";

export default function WeatherStats({ humidity, windMph, feelsLikeF }) {
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
          value={`${Math.round(feelsLikeF)}°F`}
          subLabel="Thermometer"
          iconSrc="/icons/temp.png"
        />
      </div>
    </section>
  );
}
