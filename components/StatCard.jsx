import React from "react";

export default function StatCard({ title, value, subLabel }) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#26303B]
        bg-[#26303B]
        p-4 sm:p-5
        flex flex-col
        gap-2
        w-full
        max-w-xs
        md:max-w-sm
        h-auto
        items-center md:items-start
        text-center md:text-left
      "
    >
      {/* Title */}
      <span className="font-space text-xs text-slate-400">{title}</span>

      {/* Value */}
      <span className="font-space font-semibold text-lg sm:text-xl md:text-2xl text-white break-words">
        {value}
      </span>

      {/* SubLabel */}
      <span
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 500,
          fontStyle: "Medium",
          fontSize: "16px",
          lineHeight: "24px",
          color: "#FFFFFF",
          width: "250px",
          height: "24px",
        }}
      >
        {subLabel}
      </span>
    </div>
  );
}
