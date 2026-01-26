export function getIconSrc(condition) {
  const c = condition.toLowerCase();

  if (c.includes("clear") || c.includes("sun")) return "/icons/sun.png";
  if (c.includes("cloud")) return "/icons/PartlyCloudy.png";
  if (c.includes("rain") || c.includes("drizzle")) return "/icons/Rainy.png";
  if (c.includes("storm") || c.includes("thunder")) return "/icons/storm.png";
  if (c.includes("snow")) return "/icons/snow.png";
  if (c.includes("wind")) return "/icons/wind.png";

  return "/icons/PartlyCloudy.png"; // fallback
}
