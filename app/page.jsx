"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Search from "@/components/SearchBar";
import WeatherStats from "@/components/WeatherStats";
import Footer from "@/components/Footer";

// API Key
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

/* ------------------ ICON HELPER ------------------ */
function getIconSrc(condition) {
  const c = condition.toLowerCase();
  if (c.includes("clear") || c.includes("sun")) return "/icons/sun.png";
  if (c.includes("cloud")) return "/icons/PartlyCloudy.png";
  if (c.includes("rain") || c.includes("drizzle")) return "/icons/Rainy.png";
  if (c.includes("storm") || c.includes("thunder")) return "/icons/storm.png";
  if (c.includes("snow")) return "/icons/snow.png";
  if (c.includes("wind")) return "/icons/wind.png";
  return "/icons/PartlyCloudy.png";
}

/* ------------------ CURRENT WEATHER ------------------ */
function CurrentWeather({ city, country, description, iconSrc }) {
  return (
    <section className="w-full flex justify-center mt-4 px-4 text-white">
      <div className="flex flex-col items-center text-center max-w-xl gap-3">
        <h2 className="text-2xl md:text-4xl font-semibold">
          {city}, {country}
        </h2>

        <div className="flex items-center gap-3">
          <Image src={iconSrc} alt="Weather" width={32} height={32} />
          <p className="text-sm md:text-base text-slate-300">{description}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------ FORECAST TABLE ------------------ */
function formatDayLabel(date) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { weekday: "long" });
}
function toF(c) {
  return (c * 9) / 5 + 32;
}

function ForecastTable({ days, unit }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white my-4">
        5-Day Forecast
      </p>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 overflow-hidden">
        <div className="hidden md:grid grid-cols-4 px-3 py-4 text-xs text-slate-300 bg-slate-900 border-b border-white/10">
          <span>Day</span>
          <span className="text-center">High / Low</span>
          <span>Condition</span>
          <span className="justify-self-end">Icon</span>
        </div>

        {days.map((d, idx) => (
          <div
            key={d.date}
            className={`grid grid-cols-1 md:grid-cols-4 items-center px-3 py-3.5 ${
              idx !== 0 ? "border-t border-slate-800" : ""
            }`}
          >
            <div className="text-sm text-slate-300 font-medium">
              {formatDayLabel(d.date)}
            </div>

            <div className="text-sm text-slate-300 md:text-center">
              {unit === "C"
                ? `${Math.round(d.highC)}°C / ${Math.round(d.lowC)}°C`
                : `${Math.round(toF(d.highC))}°F / ${Math.round(toF(d.lowC))}°F`}
            </div>

            <div className="text-sm text-slate-400">{d.conditionText}</div>

            <div className="flex justify-start md:justify-end">
              <Image src={d.iconSrc} alt="" width={24} height={24} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------ LOADING SKELETON ------------------ */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-6">
      <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto" />
      <div className="h-32 bg-gray-700 rounded mx-auto max-w-xl" />
      <div className="h-20 bg-gray-700 rounded mx-auto max-w-5xl" />
    </div>
  );
}

/* ================== MAIN PAGE ================== */
export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");

  /* ---------- FETCH BY CITY ---------- */
  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();

      setWeather({
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        iconSrc: getIconSrc(data.weather[0].description),
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeC: data.main.feels_like,
      });

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (!forecastRes.ok) throw new Error("Forecast not available");
      const forecastData = await forecastRes.json();

      const daysMap = {};

      forecastData.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];

        if (!daysMap[date]) {
          daysMap[date] = {
            date,
            temps: [],
            conditionText: item.weather[0].description,
            iconSrc: getIconSrc(item.weather[0].description),
          };
        }

        daysMap[date].temps.push(item.main.temp);
      });

      const days = Object.values(daysMap)
        .slice(0, 5)
        .map((day) => ({
          date: day.date,
          highC: Math.max(...day.temps),
          lowC: Math.min(...day.temps),
          conditionText: day.conditionText,
          iconSrc: day.iconSrc,
        }));

      setForecast(days);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FETCH BY LOCATION ---------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather("Amman");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        fetchWeather("Amman");
      },
    );
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );
      const data = await res.json();

      setWeather({
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        iconSrc: getIconSrc(data.weather[0].description),
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeC: data.main.feels_like,
      });

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );
      const forecastData = await forecastRes.json();
      const daysMap = {};

      forecastData.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];

        if (!daysMap[date]) {
          daysMap[date] = {
            date,
            temps: [],
            conditionText: item.weather[0].description,
            iconSrc: getIconSrc(item.weather[0].description),
          };
        }

        daysMap[date].temps.push(item.main.temp);
      });

      const days = Object.values(daysMap)
        .slice(0, 5)
        .map((day) => ({
          date: day.date,
          highC: Math.max(...day.temps),
          lowC: Math.min(...day.temps),
          conditionText: day.conditionText,
          iconSrc: day.iconSrc,
        }));

      setForecast(days);
    } catch {
      setError("Failed to load weather");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-slate-50 flex flex-col">
      <Header unit={unit} setUnit={setUnit} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4">
        <Search onSearch={fetchWeather} />

        {loading && (
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Loading your location & weather...
            </p>
            <Skeleton />
          </div>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        <div
          className={`transition-opacity duration-500 ${loading ? "opacity-50" : "opacity-100"}`}
        >
          {weather && <CurrentWeather {...weather} />}
        </div>

        {weather && !loading && (
          <WeatherStats
            humidity={weather.humidity}
            windMph={weather.windMph}
            feelsLikeC={weather.feelsLikeC}
            unit={unit}
          />
        )}

        {forecast.length > 0 && !loading && (
          <ForecastTable days={forecast} unit={unit} />
        )}
      </div>

      <Footer />
    </main>
  );
}
