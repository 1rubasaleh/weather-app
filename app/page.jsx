"use client";
// This file is a Client Component because we use useState, useEffect,
// browser APIs (geolocation), and fetch in the browser.

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Search from "@/components/SearchBar";
import WeatherStats from "@/components/WeatherStats";
import Footer from "@/components/Footer";
import ForecastTable from "@/components/ForecastTable";
import CurrentWeather from "@/components/CurrentWeather";
import { getIconSrc } from "@/lib/weatherIcons";

// OpenWeather API Key (stored safely in env variables)
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

/* --------------------------------------------------
   Skeleton Loader
   --------------------------------------------------
   - Displays a loading placeholder while weather data is being fetched
   - Improves UX by avoiding an empty screen
-------------------------------------------------- */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-6">
      <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto" />
      <div className="h-32 bg-gray-700 rounded mx-auto max-w-xl" />
      <div className="h-20 bg-gray-700 rounded mx-auto max-w-5xl" />
    </div>
  );
}

/* --------------------------------------------------
   Main Page Component
-------------------------------------------------- */
export default function Home() {
  const [weather, setWeather] = useState(null); // Current weather data
  const [forecast, setForecast] = useState([]); // 5-day forecast
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message
  const [unit, setUnit] = useState("C"); // Temperature unit

  /* --------------------------------------------------
     Fetch weather by city name
     - Used when searching or when IP fallback returns a city
  -------------------------------------------------- */
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
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeC: data.main.feels_like,
      });

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (!forecastRes.ok) throw new Error("Forecast not available");

      const forecastData = await forecastRes.json();

      // Group forecast data by day
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

      // Calculate daily high & low temperatures
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

  /* --------------------------------------------------
     Fetch weather by coordinates (GPS)
     - Used when user allows geolocation access
  -------------------------------------------------- */
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

  /* --------------------------------------------------
     Fetch weather by IP address
     - Used when:
       1) User rejects geolocation
       2) Browser doesn't support geolocation
     - If VPN is enabled → returns VPN location
  -------------------------------------------------- */
  const fetchWeatherByIP = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      if (data.city) {
        fetchWeather(data.city);
      } else {
        fetchWeather("Amman");
      }
    } catch {
      fetchWeather("Amman");
    }
  };

  /* --------------------------------------------------
     Initial location detection (on page load)
     Priority order:
     1) GPS location (if allowed)
     2) IP-based location (VPN-aware)
     3) Default city (Amman)
  -------------------------------------------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeatherByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        fetchWeatherByIP();
      },
    );
  }, []);

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <main className="min-h-screen bg-[#0F1417] text-slate-50 flex flex-col">
      <Header unit={unit} setUnit={setUnit} />

      <div className="w-324.5 h-231.75 pt-5 pr-40 pb-5 pl-40 mx-auto">
        {/* Search bar */}
        <Search onSearch={fetchWeather} />

        {/* Loading state */}
        {loading && (
          <div className="text-center">
            <p className="text-sm text-slate-400">
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
            humidity={weather.humidity}
            windMph={weather.windMph}
            feelsLikeC={weather.feelsLikeC}
            unit={unit}
          />
        )}

        {/* 5-day forecast */}
        {forecast.length > 0 && !loading && (
          <ForecastTable days={forecast} unit={unit} />
        )}
      </div>

      <Footer />
    </main>
  );
}
