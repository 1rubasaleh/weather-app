import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 md:px-8 lg:px-12 py-2 border-b border-[rgba(229,232,235,0.2)] text-white overflow-x-hidden">
      {/* Left side: icon + title */}
      <div className="flex items-center gap-3">
        <Image
          src="/icons/icon.png"
          alt="Weather icon"
          width={16}
          height={16}
          priority
        />
        <span className="text-sm md:text-base font-space font-bold">
          Weather App
        </span>
      </div>

      {/* Right side: °C + thermometer */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">°C</span>
        <Image
          src="/icons/temp.png"
          alt="Thermometer icon"
          width={20}
          height={20}
        />
      </div>
    </header>
  );
}
