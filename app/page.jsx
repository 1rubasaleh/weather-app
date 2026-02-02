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

/* ---------------- Skeleton Loader ---------------- */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-6">
      <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto" />
      <div className="h-32 bg-gray-700 rounded mx-auto max-w-xl" />
      <div className="h-20 bg-gray-700 rounded mx-auto max-w-5xl" />
    </div>
  );
}

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");

  /* ---------------- Fetch weather by city ---------------- */
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

  /* ---------------- Fetch weather by coordinates ---------------- */
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

  /* ---------------- Fetch weather by IP ---------------- */
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

  /* ---------------- Initial load ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeatherByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeatherByIP(),
    );
  }, []);

  /* ---------------- Render ---------------- */
  return (
    <main className="min-h-screen flex flex-col bg-[#0F1417] text-slate-50">
      <Header unit={unit} setUnit={setUnit} />

      {/* Container الرئيسي - flex-grow + scrollable */}
      <div className="flex-grow overflow-auto w-[90%] sm:w-full max-w-5xl px-4 sm:px-6 md:px-10 mx-auto flex flex-col">
        <Search onSearch={fetchWeather} />

        {loading && (
          <div className="text-center flex flex-col items-center mt-6">
            <p className="text-sm text-slate-400 mb-4">
              Loading your location & weather...
            </p>
            <Skeleton />
          </div>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {weather && !loading && (
          <CurrentWeather
            city={weather.city}
            country={weather.country}
            description={weather.description}
            temp={weather.feelsLikeC}
            unit={unit}
          />
        )}

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
