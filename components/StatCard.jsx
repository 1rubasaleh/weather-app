import Image from "next/image";

export default function StatCard({ title, value, subLabel, iconSrc }) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#26303B]
        bg-[#26303B]
        p-4 md:p-5
        flex flex-col
        gap-[8px]
        h-35.5 w-[298.67px]
  
      "
    >
      {/* Title */}
      <span
        className="
          font-space
          text-xs
          text-slate-400
        "
      >
        {title}
      </span>

      {/* Value */}
      <span
        className="
          font-space
          font-semibold
          text-xl md:text-2xl
          text-white
          break-words
        "
      >
        {value}
      </span>

      {/* Icon + SubLabel */}
      <div
        className="
          mt-1
          flex
          items-center
          gap-2
          text-[11px]
          text-slate-400
        "
      >
        <Image
          src={iconSrc}
          alt={subLabel}
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="font-space">{subLabel}</span>
      </div>
    </div>
  );
}
