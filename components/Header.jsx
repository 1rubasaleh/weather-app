import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b  border-[rgba(229,232,235,0.2)] text-white">
      {/* Left side: icon + title */}
      <div className="flex items-center gap-4">
        <Image
          src="/icons/icon.png"
          alt="Weather icon"
          width={16}
          height={16}
        />
        <span className="text-lg w-28 h-5.75 font-space font-bold text-[18px] leading-5.75 tracking-[0px">
          Weather App
        </span>
      </div>

      {/* Right side: °C + thermometer */}
      <div className="flex items-center ">
        <span className="text-sm font-bold text-[18px leading-5.75 tracking-[0px] h-5.75 w-6.75">
          °C
        </span>
        <Image
          src="/icons/temp.png"
          alt="Thermometer icon"
          width={25}
          height={25}
        />
      </div>
    </header>
  );
}
