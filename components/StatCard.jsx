import Image from "next/image";

/*
  StatCard Component
  ------------------
  - Mobile: content centered
  - Desktop: content left-aligned
*/
export default function StatCard({ title, value, subLabel, iconSrc }) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#26303B]
        bg-[#26303B]
        p-4 sm:p-5
        flex flex-col
        gap-3
        w-full
        max-w-xs
        md:max-w-sm
        h-auto
        items-center md:items-start
        text-center md:text-left
      "
    >
      {/* Title */}
      <span className="font-space text-xs text-slate-400">
        {title}
      </span>

      {/* Value */}
      <span className="font-space font-semibold text-lg sm:text-xl md:text-2xl text-white break-words">
        {value}
      </span>

      {/* Icon + SubLabel */}
      <div className="mt-1 flex items-center justify-center md:justify-start gap-2 text-[11px] sm:text-xs text-slate-400">
        <Image
          src={iconSrc}
          alt={subLabel}
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="font-space">{subLabel}</span>
      </div>
    </div>
  );
}
