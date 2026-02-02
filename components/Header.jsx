import Image from "next/image";

export default function Header({ unit, setUnit }) {
  return (
    <header
      className="
        w-full
        h-12
        flex
        items-center
        justify-between
        px-10
        border-b border-[#E5E8EB33]
        text-white
      "
    >
      {/* Left: icon + title */}
      <div className="flex items-center gap-4 w-36 h-5.75">
        <Image
          src="/icons/icon.png"
          alt="Weather icon"
          width={16}
          height={16}
          priority
        />
        <span
          style={{ fontFamily: "var(--font-space)" }}
          className=" w-28  h-5.75  text-[18px] leading-5.75  font-space font-bold  tracking-[0px]"
        >
          Weather App
        </span>
      </div>

      {/* Right: unit toggle */}
      <div className="flex items-center gap-2 w-13 h-5.75 opacity-100">
        <span
          style={{ fontFamily: "var(--font-space)" }}
          onClick={() => setUnit(unit === "C" ? "F" : "C")}
          className="cursor-pointer select-none  text-[18px] leading-5.75 font-space font-bold tracking-[0px] hover:text-blue-400 transition h-5.75 w-6.75 "
        >
          °{unit}
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
