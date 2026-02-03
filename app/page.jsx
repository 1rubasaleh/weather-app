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
const DEFAULT_CITY = "Amman"; // Default capital city

// ---------------- Skeleton Loader ----------------
// Shows placeholder while loading weather data
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
  const [weather, setWeather] = useState(null); // Current weather info
  const [forecast, setForecast] = useState([]); // 5-day forecast
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message
  const [unit, setUnit] = useState("C"); // Temperature unit

  // ---------- Fetch weather by coordinates ----------
  const fetchWeatherByCoords = async (lat, lon, locationName) => {
    setLoading(true);
    setError("");

    try {
      // Fetch current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      );
      const data = await res.json();

      setWeather({
        location: locationName || `${data.name}, ${data.sys.country}`, // Show area + city if available
        description: data.weather[0].description,
        iconSrc: getIconSrc(data.weather[0].description),
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeC: Math.round(data.main.feels_like),
      });

      // Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      );
      const forecastData = await forecastRes.json();

      // Group forecast by date
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

      // Convert daysMap to array and calculate high/low
      setForecast(
        Object.values(daysMap)
          .slice(0, 5)
          .map((d) => ({
            date: d.date,
            highC: Math.round(Math.max(...d.temps)),
            lowC: Math.round(Math.min(...d.temps)),
            conditionText: d.conditionText,
            iconSrc: d.iconSrc,
          })),
      );
    } catch {
      setError("Failed to load weather");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Handle search from SearchBar ----------
  const handleSearch = async (label) => {
    setLoading(true);
    setError("");

    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${label}&limit=1&appid=${API_KEY}`,
      );
      const geoData = await geoRes.json();

      if (!geoData[0]) throw new Error("Location not found");

      await fetchWeatherByCoords(geoData[0].lat, geoData[0].lon, label);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ---------- Initial load ----------
  useEffect(() => {
    if (!navigator.geolocation) {
      // If no geolocation → fallback to capital city
      handleSearch(DEFAULT_CITY);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        // Reverse geocode to get precise area + city
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
        )
          .then((res) => res.json())
          .then((data) => {
            const city = data.address.city || data.address.town || DEFAULT_CITY;
            const suburb =
              data.address.suburb || data.address.neighbourhood || "";
            const location = suburb ? `${suburb}, ${city}` : city;

            fetchWeatherByCoords(latitude, longitude, location);
          })
          .catch(() => handleSearch(DEFAULT_CITY));
      },
      () => handleSearch(DEFAULT_CITY), // User denies permission → fallback to capital
      { enableHighAccuracy: true },
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#0F1417] text-slate-50 flex flex-col">
      <Header unit={unit} setUnit={setUnit} />

      <div className="w-[90%] max-w-5xl mx-auto px-4">
        <Search onSearch={handleSearch} />

        {loading && (
          <div className="text-center mt-6">
            <Skeleton />
          </div>
        )}

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {weather && !loading && (
          <>
            <CurrentWeather
              location={weather.location}
              description={weather.description}
              temp={weather.feelsLikeC}
              unit={unit}
            />

            <WeatherStats
              humidity={weather.humidity}
              windMph={weather.windMph}
              feelsLikeC={weather.feelsLikeC}
              unit={unit}
            />

            <ForecastTable days={forecast} unit={unit} />
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
