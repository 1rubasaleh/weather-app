import Image from "next/image";

/* --------------------------------------------------
   Header Component
   --------------------------------------------------
   - Displays app logo + title on the left
   - Displays temperature unit toggle on the right
   - Fully responsive (mobile / tablet / laptop)
-------------------------------------------------- */
export default function Header({ unit, setUnit }) {
  return (
    <header
      className="
        w-full
        flex
        items-center
        justify-between
        px-4 sm:px-6 md:px-10
        py-3
        border-b border-[#E5E8EB33]
        text-white
      "
    >
      {/* Left: App icon + title */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <Image
          src="/icons/icon.png"
          alt="Weather icon"
          width={16}
          height={16}
          priority
        />

        <span
          style={{ fontFamily: "var(--font-space)" }}
          className="
            text-base
            sm:text-lg
            md:text-xl
            font-bold
            whitespace-nowrap
            h-[23px]
            w-[112px]
          "
        >
          Weather App
        </span>
      </div>

      {/* Right: Temperature unit toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span
          style={{ fontFamily: "var(--font-space)" }}
          onClick={() => setUnit(unit === "C" ? "F" : "C")}
          className="
            cursor-pointer
            select-none
            text-base
            sm:text-lg
            md:text-xl
            font-bold
            hover:text-blue-400
            transition
          "
        >
          °{unit}
        </span>

        <Image
          src="/icons/temp.png"
          alt="Thermometer icon"
          width={22}
          height={22}
        />
      </div>
    </header>
  );
}
