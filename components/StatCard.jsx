import Image from "next/image";

/*
  StatCard Component
  ------------------
  - Displays a single weather statistic
  - Shows title, value, icon, and sub-label
  - Fully responsive: adjusts width, padding, and font sizes
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
        gap-4
        w-full
        max-w-xs
        md:max-w-sm
        h-auto
      "
    >
      {/* Title */}
      <span className="font-space text-xs text-slate-400">{title}</span>

      {/* Value */}
      <span className="font-space font-semibold text-lg sm:text-xl md:text-2xl text-white break-words">
        {value}
      </span>

      {/* Icon + SubLabel */}
      <div className="mt-1 flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
        <Image
          src={iconSrc}
          alt={subLabel}
          width={20} // slightly larger on all screens
          height={20}
          className="shrink-0"
        />
        <span className="font-space">{subLabel}</span>
      </div>
    </div>
  );
}
