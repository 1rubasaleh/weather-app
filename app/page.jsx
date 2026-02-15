"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/components/Header";
import Search from "@/components/SearchBar";
import WeatherStats from "@/components/WeatherStats";
import Footer from "@/components/Footer";
import ForecastTable from "@/components/ForecastTable";
import CurrentWeather from "@/components/CurrentWeather";
import { getIconSrc } from "@/lib/weatherIcons";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const DEFAULT_CITY = "Amman";

/* ================= Animations ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ================= Skeleton Loader ================= */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-10">
      <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto" />
      <div className="h-32 bg-gray-700 rounded" />
      <div className="h-24 bg-gray-700 rounded" />
    </div>
  );
}

/* ================= Helper ================= */
function getNextDate(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");

  const fetchWeatherByCoords = async (lat, lon, locationName) => {
    try {
      setLoading(true);
      setError("");

      /* ===== Current Weather ===== */
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`,
      );
      const data = await res.json();

      if (!data || !data.weather) throw new Error();

      setWeather({
        location: locationName,
        description: data.weather[0].description,
        iconSrc: getIconSrc(data.weather[0].description),
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeC: Math.round(data.main.feels_like),
      });

      /* ===== Forecast ===== */
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`,
      );
      const forecastData = await forecastRes.json();

      if (!forecastData?.list?.length) {
        setForecast([]);
        return;
      }

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

      let daysArray = Object.values(daysMap);

      if (!daysArray.length) {
        setForecast([]);
        return;
      }

      while (daysArray.length < 6 && daysArray.length > 0) {
        const lastDay = daysArray[daysArray.length - 1];
        if (!lastDay) break;

        daysArray.push({
          ...lastDay,
          date: getNextDate(lastDay.date),
          temps: lastDay.temps,
        });
      }

      const finalForecast = daysArray.slice(1, 6).map((d) => ({
        date: d.date,
        highC: Math.round(Math.max(...d.temps)),
        lowC: Math.round(Math.min(...d.temps)),
        conditionText: d.conditionText,
        iconSrc: d.iconSrc,
      }));

      setForecast(finalForecast);
    } catch (err) {
      console.error(err);
      setWeather(null);
      setForecast([]);
      setError("Failed to load weather");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (label) => {
    if (!label) {
      setError("Not Found. Try again");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${label}&limit=1&appid=${API_KEY}`,
      );
      const geoData = await geoRes.json();

      if (!geoData?.[0]) throw new Error();

      const p = geoData[0];
      await fetchWeatherByCoords(p.lat, p.lon, `${p.name}, ${p.country}`);
    } catch {
      setWeather(null);
      setForecast([]);
      setLoading(false);
      setError("Not Found. Try again");
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      handleSearch(DEFAULT_CITY);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`,
          );
          const data = await res.json();
          const a = data.address || {};

          const parts = [
            a.suburb || a.neighbourhood || a.village,
            a.city || a.town || a.state,
            a.country,
          ].filter(Boolean);

          const locationName = parts.join("، ");
          await fetchWeatherByCoords(latitude, longitude, locationName);
        } catch {
          handleSearch(DEFAULT_CITY);
        }
      },
      () => handleSearch(DEFAULT_CITY),
      { enableHighAccuracy: true },
    );
  }, []);

  return (
    <main className="min-h-screen bg-[#0F1417] text-slate-50 flex flex-col overflow-x-hidden">
      <Header unit={unit} setUnit={setUnit} />

      <div className="w-full max-w-[960px] mx-auto px-4 flex-1">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <Search onSearch={handleSearch} />
        </motion.div>

        {loading && <Skeleton />}

        {!loading && error && (
          <p className="text-center text-red-500 mt-6">{error}</p>
        )}

        <AnimatePresence>
          {!loading && weather && forecast.length > 0 && !error && (
            <>
              <motion.section
                variants={fadeLeft}
                initial="hidden"
                animate="visible"
                className="mt-10"
              >
                <CurrentWeather
                  location={weather.location}
                  description={weather.description}
                  temp={weather.feelsLikeC}
                  unit={unit}
                />
              </motion.section>

              <motion.section
                variants={fadeRight}
                initial="hidden"
                animate="visible"
                className="mt-6"
              >
                <WeatherStats
                  humidity={weather.humidity}
                  windMph={weather.windMph}
                  feelsLikeC={weather.feelsLikeC}
                  unit={unit}
                />
              </motion.section>

              <section className="mt-8">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="overflow-x-auto"
                >
                  <ForecastTable days={forecast} unit={unit} />
                </motion.div>
              </section>
            </>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
