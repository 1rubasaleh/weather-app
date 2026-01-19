import Image from "next/image";

function getIconSrc(condition) {
  const c = condition.toLowerCase();

  if (c.includes("clear") || c.includes("sun")) return "/icons/sun.png";
  if (c.includes("cloud")) return "/icons/PartlyCloudy.png";
  if (c.includes("rain") || c.includes("drizzle")) return "/icons/Rainy.png";
  if (c.includes("storm") || c.includes("thunder")) return "/icons/storm.png";
  if (c.includes("snow")) return "/icons/snow.png";
  if (c.includes("wind")) return "/icons/wind.png";

  return "/icons/PartlyCloudy.png"; // fallback
}

export default function CurrentWeather({
  city,
  country,
  condition,
  description,
}) {
  const iconSrc = getIconSrc(condition);

  return (
    <section className="w-full flex justify-center mt-4 px-4 text-white overflow-x-hidden">
      <div className="flex flex-col items-center text-center max-w-xl gap-3">
        {/* City & Country */}
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight break-words">
          {city}, {country}
        </h2>

        {/* Icon + description */}
        <div className="flex items-center gap-3">
          <Image
            src={iconSrc}
            alt="Weather condition"
            width={32}
            height={32}
            className="shrink-0"
            priority
          />

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
