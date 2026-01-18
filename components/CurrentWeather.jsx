import Image from "next/image";

export default function CurrentWeather() {
  return (
    <section className="flex flex-col items-center text-center mt-10 text-white">
      {/* City name */}
      <h2 className="text-3xl font-bold">Amman, Jordan</h2>

      {/* Weather icon */}
      <div className="my-6">
        <Image
          src="/icons/sun.png"
          alt="Weather condition"
          width={52}
          height={52}
        />
      </div>

      {/* Description */}
      <p className="text-gray-300 text-base leading-6 text-center">
        Mostly clear with a high of 75°F
      </p>
    </section>
  );
}
