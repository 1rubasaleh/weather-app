import Image from "next/image";

export default function StatCard({ title, value, subLabel, iconSrc }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 md:px-5 md:py-4 flex flex-col gap-1">
      <span className="text-xs text-slate-400">{title}</span>

      <span className="text-xl md:text-2xl font-semibold text-white break-words">
        {value}
      </span>

      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
        <Image
          src={iconSrc}
          alt=""
          width={18}
          height={18}
          className="shrink-0"
        />
        <span>{subLabel}</span>
      </div>
    </div>
  );
}
