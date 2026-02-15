import StatCard from "./StatCard";

// Convert Celsius to Fahrenheit
function cToF(c) {
  return (c * 9) / 5 + 32;
}

export default function WeatherStats({ humidity, windMph, feelsLikeC, unit }) {
  return (
    <section className="w-full flex justify-center mt-4 px-4">
      <div
        className="
          w-full max-w-[960px]
          grid
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3
          gap-4
        "
      >
        {/* Humidity */}
        <StatCard title="Humidity" value={`${humidity}%`} subLabel="Cloud" />

        {/* Wind */}
        <StatCard title="Wind" value={`${windMph} mph`} subLabel="Wind" />

        {/* Feels Like */}
        <div className="sm:col-span-2 md:col-span-1">
          <StatCard
            title="Feels Like"
            value={
              unit === "C"
                ? `${Math.round(feelsLikeC)}°C`
                : `${Math.round(cToF(feelsLikeC))}°F`
            }
            subLabel="Thermometer"
          />
        </div>
      </div>
    </section>
  );
}
