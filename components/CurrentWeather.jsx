import Image from "next/image";
import { getIconSrc } from "@/lib/weatherIcons";

export default function CurrentWeather({ city, country, description }) {
  const iconSrc = getIconSrc(description);
  return (
    <section className="w-full flex justify-center mt-4 px-4 text-white">
      <div className="flex flex-col items-center text-center max-w-xl gap-3">
        <h2 className="text-2xl md:text-4xl font-semibold">
          {city}, {country}
        </h2>

        <div className="flex items-center gap-3">
          <Image src={iconSrc} alt="Weather" width={32} height={32} />
          <p className="text-sm md:text-base text-slate-300">{description}</p>
        </div>
      </div>
    </section>
  );
}
