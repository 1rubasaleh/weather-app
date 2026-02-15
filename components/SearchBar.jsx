"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

/** ---------- Search Component ---------- */
export default function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  const fetchSuggestions = async (value) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`,
      );
      const data = await res.json();
      if (!data || data.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        return false;
      }
      const formatted = data.map((item) => `${item.name}, ${item.country}`);
      setSuggestions(formatted);
      setShowSuggestions(true);
      return true;
    } catch (err) {
      console.error(err);
      setSuggestions([]);
      setShowSuggestions(false);
      return false;
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value.trim());
    }, 400);
  };

  useEffect(() => {
    const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(searches);
  }, []);

  const handleSearch = async (searchCity = city) => {
    if (!searchCity.trim()) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const hasSuggestions = await fetchSuggestions(searchCity);

    if (!hasSuggestions) {
      onSearch(null);
      setCity("");
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    onSearch(searchCity);

    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    searches = [searchCity, ...searches.filter((c) => c !== searchCity)].slice(
      0,
      5,
    );
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    setRecentSearches(searches);

    setCity("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  return (
    <section className="w-full flex justify-center mt-10 relative">
      <div className="w-full px-4 sm:px-6 md:max-w-[960px] mx-auto relative">
        <div className="relative w-full">
          {/* Search icon */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            style={{ fontFamily: "var(--font-space)" }}
            type="text"
            placeholder="Search for a city"
            value={city}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="
              w-full h-12 rounded-xl pl-10 pr-4 bg-[#26303B]
              border border-gray-700 text-[14px] sm:text-base
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 z-50 bg-[#26303B] border border-gray-700 rounded-xl max-h-60 overflow-y-auto">
              {suggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="px-4 py-3 text-white hover:bg-[#2F3A46] cursor-pointer text-[14px] sm:text-base"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 justify-start sm:justify-center">
            {recentSearches.map((c) => (
              <button
                key={c}
                onClick={() => handleSearch(c)}
                className="px-3 py-1 text-[14px] sm:text-sm rounded-lg bg-[#26303B] text-white hover:bg-[#2F3A46]"
              >
                {c}
              </button>
            ))}
            <button
              onClick={handleClearHistory}
              className="px-3 py-1 text-[14px] sm:text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/** ---------- ForecastTable Component ---------- */
function formatDayLabel(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { weekday: "long" });
}

function toF(c) {
  return (c * 9) / 5 + 32;
}

export function ForecastTable({ days = [], unit }) {
  const forecast = days;

  return (
    <section className="w-full flex justify-center">
      <div className="w-full max-w-[960px] mx-auto overflow-x-auto">
        <div className="w-full flex items-center px-4 py-3">
          <p
            className="text-[#FFFFFF] font-bold text-[22px] w-full"
            style={{ fontFamily: "Space Grotesk" }}
          >
            5-Day Forecast
          </p>
        </div>

        <div className="border border-[#384757] rounded-[12px] w-full">
          {/* Header - Desktop */}
          <div
            className="hidden md:grid md:grid-cols-[200px_220px_300px_1fr] px-6 h-[46px] items-center text-[14px] text-[#FFFFFF] bg-[#1C2129] border-b border-white"
            style={{ fontFamily: "var(--font-space)" }}
          >
            <span>Day</span>
            <span className="text-center">High / Low</span>
            <span className="text-center">Condition</span>
            <span className="justify-self-end"></span>
          </div>

          {/* Forecast Rows */}
          {forecast.map((d, idx) => (
            <div
              key={d.date}
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[200px_220px_300px_1fr] gap-2 md:h-[72px] items-center px-4 md:px-6 py-3 md:py-0 bg-[#0F1417] text-[#FFFFFF] ${idx !== 0 ? "border-t border-white" : ""}`}
            >
              <div
                className="text-sm font-medium"
                style={{ fontFamily: "var(--font-space)" }}
              >
                {formatDayLabel(d.date)}
              </div>
              <div
                className="text-sm md:text-center"
                style={{ fontFamily: "var(--font-space)" }}
              >
                {unit === "C"
                  ? `${Math.round(d.highC)}°C / ${Math.round(d.lowC)}°C`
                  : `${Math.round(toF(d.highC))}°F / ${Math.round(toF(d.lowC))}°F`}
              </div>
              <div
                className="flex items-center justify-between text-sm md:justify-center gap-2"
                style={{ fontFamily: "var(--font-space)" }}
              >
                <span>{d.conditionText}</span>
                <div className="md:hidden flex-shrink-0">
                  <Image
                    src={d.iconSrc}
                    alt=""
                    width={28}
                    height={28}
                    style={{ display: "block" }}
                  />
                </div>
              </div>
              <div className="hidden md:flex justify-end items-center">
                <Image
                  src={d.iconSrc}
                  alt=""
                  width={24}
                  height={24}
                  style={{ display: "block" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
