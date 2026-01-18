import Image from "next/image";

function getIconSrc(condition) {
  if (condition === "sun") return "/icons/sun.png";
  if (condition === "clouds") return "/icons/clouds.png";
  if (condition === "rain") return "/icons/rain.png";
  if (condition === "storm") return "/icons/storm.png";
  if (condition === "snow") return "/icons/snow.png";
  if (condition === "fog") return "/icons/fog.png";
  return "/icons/clouds.png";
}

export default function CurrentWeather({
  city,
  country,
  condition,
  description,
}) {
  const iconSrc = getIconSrc(condition);

  return (
    <section className="w-full flex justify-center mt-10 text-white">
      <div className="flex flex-col items-center text-center max-w-xl gap-4">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {city}, {country}
        </h2>

        <div className="flex items-center gap-3 mt-2">
          <Image
            src={iconSrc}
            alt="Weather condition"
            width={51}
            height={51}
            className="shrink-0"
          />
          <p className="text-sm md:text-base text-slate-300 leading-6">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
