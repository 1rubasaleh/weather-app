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
      <span
        className="font-space text-xs text-white"
        style={{ fontFamily: "Space Grotesk" }}
      >
        {title}
      </span>

      {/* Value */}
      <span
        className="font-space font-semibold text-lg sm:text-xl md:text-2xl text-white break-words"
        style={{ fontFamily: "Space Grotesk" }}
      >
        {value}
      </span>

      {/* SubLabel */}
      <span
        className="text-slate-400"
        style={{
          fontFamily: "Space Grotesk",
          fontWeight: 500,
          fontStyle: "Medium",
          fontSize: "14px",
          lineHeight: "20px",
        }}
      >
        {subLabel}
      </span>
    </div>
  );
}
