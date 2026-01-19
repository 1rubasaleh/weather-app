"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Search from "@/components/SearchBar";
import WeatherStats from "@/components/WeatherStats";
import Footer from "@/components/Footer";

// API Key from .env.local
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

function getIconSrc(condition) {
  const c = condition.toLowerCase();
  if (c.includes("clear") || c.includes("sun")) return "/icons/sun.png";
  if (c.includes("cloud")) return "/icons/PartlyCloudy.png";
  if (c.includes("rain") || c.includes("drizzle")) return "/icons/Rainy.png";
  if (c.includes("storm") || c.includes("thunder")) return "/icons/storm.png";
  if (c.includes("snow")) return "/icons/snow.png";
  if (c.includes("wind")) return "/icons/wind.png";
  return "/icons/PartlyCloudy.png"; // fallback
}

// --------- Component CurrentWeather ---------
function CurrentWeather({ city, country, description, iconSrc }) {
  return (
    <section className="w-full flex justify-center mt-4 px-4 text-white overflow-x-hidden">
      <div className="flex flex-col items-center text-center max-w-xl gap-3">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight break-words">
          {city}, {country}
        </h2>

        <div className="flex items-center gap-3">
          <Image
            src={iconSrc}
            alt="Weather condition"
            width={32}
            height={32}
            className="shrink-0"
            priority
          />
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

// --------- Component ForecastTable ---------
function formatDayLabel(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

function ForecastTable({ days }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 overflow-x-hidden">
      <p className="text-xs uppercase tracking-[0.2em] text-white my-4">
        5-Day Forecast
      </p>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/80 overflow-hidden">
        {/* Table header (desktop only) */}
        <div className="hidden md:grid grid-cols-4 px-3 py-4 text-xs text-slate-300 bg-slate-900 border-b border-white/10">
          <span>Day</span>
          <span className="text-center">High / Low</span>
          <span>Condition</span>
          <span className="justify-self-end">Icon</span>
        </div>

        {days.map((d, idx) => (
          <div
            key={d.date}
            className={
              "grid grid-cols-1 md:grid-cols-4 items-center px-3 py-3.5 gap-2 md:gap-0 " +
              (idx !== 0 ? "border-t border-slate-800" : "")
            }
          >
            <div className="text-sm text-slate-300 font-medium">
              {formatDayLabel(d.date)}
            </div>
            <div className="text-sm text-slate-300 md:text-center">
              {Math.round(d.highF)}°F / {Math.round(d.lowF)}°F
            </div>
            <div className="text-sm text-slate-400 break-words">
              {d.conditionText}
            </div>
            <div className="flex justify-start md:justify-end">
              <Image
                src={d.iconSrc}
                alt=""
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");

    try {
      // Current Weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`,
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();

      const iconSrc = getIconSrc(data.weather[0].description);

      setWeather({
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        iconSrc,
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeF: data.main.feels_like,
      });

      // 5-Day Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`,
      );
      if (!forecastRes.ok) throw new Error("Forecast not found");
      const forecastData = await forecastRes.json();

      const days = forecastData.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .map((item) => ({
          date: item.dt_txt,
          highF: item.main.temp_max,
          lowF: item.main.temp_min,
          conditionText: item.weather[0].description,
          iconSrc: getIconSrc(item.weather[0].description),
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

  // --------- Fetch by coordinates ---------
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();

      const iconSrc = getIconSrc(data.weather[0].description);

      setWeather({
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        iconSrc,
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeF: data.main.feels_like,
      });

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`,
      );
      if (!forecastRes.ok) throw new Error("Forecast not found");
      const forecastData = await forecastRes.json();

      const days = forecastData.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .map((item) => ({
          date: item.dt_txt,
          highF: item.main.temp_max,
          lowF: item.main.temp_min,
          conditionText: item.weather[0].description,
          iconSrc: getIconSrc(item.weather[0].description),
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

  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // fallback if user denies location
          fetchWeather("Amman");
        },
      );
    } else {
      fetchWeather("Amman");
    }
  }, []);

  const Skeleton = () => (
    <div className="animate-pulse space-y-4 mt-4">
      <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto"></div>
      <div className="h-32 bg-gray-700 rounded mx-auto max-w-xl"></div>
      <div className="h-20 bg-gray-700 rounded mx-auto max-w-5xl"></div>
    </div>
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-black to-gray-900 text-slate-50 flex flex-col">
      <Header />

      <div className="flex-1 w-full">
        <div className="max-w-5xl mx-auto w-full px-4">
          <Search onSearch={fetchWeather} />
          {loading && <Skeleton />}
          {loading && (
            <div className="text-center mt-4">
              <p>Loading your location & weather...</p>
              <Skeleton />
            </div>
          )}
          {error && <p className="text-center mt-4 text-red-500">{error}</p>}
          {weather && !loading && <CurrentWeather {...weather} />}
          {weather && !loading && (
            <WeatherStats
              humidity={weather.humidity}
              windMph={weather.windMph}
              feelsLikeF={weather.feelsLikeF}
            />
          )}
          {forecast.length > 0 && !loading && <ForecastTable days={forecast} />}
        </div>
      </div>

      <Footer />
    </main>
  );
}
