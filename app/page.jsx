"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Search from "@/components/SearchBar";
import WeatherStats from "@/components/WeatherStats";
import Footer from "@/components/Footer";
import ForecastTable from "@/components/ForecastTable";
import CurrentWeather from "@/components/CurrentWeather";
import { getIconSrc } from "@/lib/weatherIcons";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

/* ---------------- Skeleton Loader ----------------
   Shows placeholder UI while weather data is loading
--------------------------------------------------- */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-6">
      <div className="h-8 bg-gray-700 rounded w-2/5 mx-auto" />
      <div className="h-32 bg-gray-700 rounded mx-auto max-w-lg" />
      <div className="h-20 bg-gray-700 rounded mx-auto max-w-4xl" />
    </div>
  );
}

/* ---------------- Main Page Component ---------------- */
export default function Home() {
  const [hydrated, setHydrated] = useState(false); // Prevent SSR mismatch
  const [weather, setWeather] = useState(null); // Current weather
  const [forecast, setForecast] = useState([]); // 5-day forecast
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error messages
  const [unit, setUnit] = useState("C"); // Temperature unit

  /* ---------------- Hydration check ----------------
     Only render UI after client-side mount
  -------------------------------------------------- */
  useEffect(() => {
    setHydrated(true);
  }, []);

  /* ---------------- Fetch weather by city ---------------- */
  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");
    try {
      // Fetch current weather
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
        humidity: data.main.humidity ?? 0,
        windMph: data.wind.speed ?? 0,
        feelsLikeC: data.main.feels_like ?? 0,
      });

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (!forecastRes.ok) throw new Error("Forecast not available");
      const forecastData = await forecastRes.json();

      // Group forecast data by date
      const daysMap = {};
      forecastData.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!daysMap[date]) {
          daysMap[date] = {
            date,
            temps: [],
            conditionText: item.weather[0]?.description ?? "",
            iconSrc: getIconSrc(item.weather[0]?.description ?? ""),
          };
        }
        daysMap[date].temps.push(item.main.temp ?? 0);
      });

      // Convert map to array and calculate high/low
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

  /* ---------------- Fetch weather by coordinates ---------------- */
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      await fetchWeather(`${lat},${lon}`);
    } catch {
      setError("Failed to load weather");
    }
  };

  /* ---------------- Fetch weather by IP fallback ---------------- */
  const fetchWeatherByIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      fetchWeather(data.city ?? "Amman");
    } catch {
      fetchWeather("Amman");
    }
  };

  /* ---------------- Initial load: Geolocation > IP fallback ---------------- */
  useEffect(() => {
    if (!hydrated) return;
    if (!navigator.geolocation) {
      fetchWeatherByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeatherByIP(),
    );
  }, [hydrated]);

  /* ---------------- Render ---------------- */
  if (!hydrated) return <Skeleton />; // Avoid SSR mismatch

  return (
    <main className="min-h-screen bg-[#0F1417] text-slate-50 flex flex-col overflow-x-hidden">
      <Header unit={unit} setUnit={setUnit} />

      <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col gap-6 box-border">
        {/* Search bar */}
        <Search onSearch={fetchWeather} />

        {/* Loading state */}
        {loading && (
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-4">
              Loading your location & weather...
            </p>
            <Skeleton />
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {/* Current weather */}
        {weather && !loading && (
          <CurrentWeather
            city={weather.city}
            country={weather.country}
            description={weather.description}
            temp={weather.feelsLikeC}
            unit={unit}
          />
        )}

        {/* Weather statistics */}
        {weather && !loading && (
          <WeatherStats
            humidity={weather.humidity ?? 0}
            windMph={weather.windMph ?? 0}
            feelsLikeC={weather.feelsLikeC ?? 0}
            unit={unit}
          />
        )}

        {/* 5-day forecast */}
        {forecast?.length > 0 && !loading && (
          <ForecastTable days={forecast ?? []} unit={unit} />
        )}
      </div>

      <Footer />
    </main>
  );
}
