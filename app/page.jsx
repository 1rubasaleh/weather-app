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
const DEFAULT_CITY = "Amman"; // fallback

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

  // ---- Fetch weather by coordinates ----
  const fetchWeatherByCoords = async (lat, lon, locationName) => {
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    try {
      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`,
      );
      const data = await res.json();

      setWeather({
        location: locationName,
        description: data.weather[0].description,
        iconSrc: getIconSrc(data.weather[0].description),
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeC: Math.round(data.main.feels_like),
      });

      // Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`,
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
      setWeather(null);
      setForecast([]);
      setError("Failed to load weather");
    } finally {
      setLoading(false);
    }
  };

  // ---- Search by label ----
  const handleSearch = async (label) => {
    if (!label) {
      setWeather(null);
      setForecast([]);
      setError("Not Found. Try again");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${label}&limit=1&appid=${API_KEY}`,
      );
      const geoData = await geoRes.json();

      if (!geoData[0]) {
        setWeather(null);
        setForecast([]);
        setError("Not Found. Try again");
        setLoading(false);
        return;
      }

      const place = geoData[0];
      const location = `${place.name}, ${place.country}`;
      await fetchWeatherByCoords(place.lat, place.lon, location);
    } catch {
      setWeather(null);
      setForecast([]);
      setError("Not Found. Try again");
    } finally {
      setLoading(false);
    }
  };

  // ---- Use geolocation or fallback to country capital ----
  useEffect(() => {
    const getCapitalByCountry = async (countryCode) => {
      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha/${countryCode}`,
        );
        const data = await res.json();
        if (data[0] && data[0].capital && data[0].capital.length > 0) {
          return data[0].capital[0];
        }
      } catch {}
      return DEFAULT_CITY;
    };

    const handleFallbackByIP = async () => {
      try {
        // free IP Geolocation API
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const capitalCity = await getCapitalByCountry(data.country_code);
        handleSearch(capitalCity);
      } catch {
        handleSearch(DEFAULT_CITY);
      }
    };

    if (!navigator.geolocation) {
      handleFallbackByIP();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
          );
          const data = await res.json();
          const a = data.address || {};
          const parts = [
            a.suburb || a.neighbourhood || a.village,
            a.city || a.town || a.state,
            a.country,
          ].filter(Boolean);
          const locationName = parts.join(", ");
          fetchWeatherByCoords(latitude, longitude, locationName);
        } catch {
          handleFallbackByIP();
        }
      },
      () => handleFallbackByIP(),
      { enableHighAccuracy: true },
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#0F1417] text-slate-50 flex flex-col px-2 sm:px-6">
      <Header unit={unit} setUnit={setUnit} />

      <div className="w-[90%] max-w-5xl mx-auto">
        <Search onSearch={handleSearch} />

        {loading && <Skeleton />}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        {weather && forecast.length > 0 && !error && !loading && (
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
