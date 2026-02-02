import Image from "next/image";

/* ------------------ StatCard ------------------ */
export function StatCard({ title, value, subLabel, iconSrc }) {
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
        mx-auto
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
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="font-space">{subLabel}</span>
      </div>
    </div>
  );
}

/* ------------------ StatsContainer ------------------ */
export default function StatsContainer({ stats }) {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        gap-4
        w-full
        sm:flex-row sm:flex-wrap sm:justify-center
      "
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subLabel={stat.subLabel}
          iconSrc={stat.iconSrc}
        />
      ))}
    </div>
  );
}
