"use client";

import { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function Search({ onSearch }) {
  const [city, setCity] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
      );
      const data = await res.json();

      const formatted = data.map(
        (item) => `${item.name}, ${item.country}`
      );
      setSuggestions(formatted);
    } catch (err) {
      console.error("Failed to fetch city suggestions:", err);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const searches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(searches);
  }, []);

  const handleSearch = (searchCity = city) => {
    if (!searchCity.trim()) return;

    onSearch(searchCity);

    let searches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    if (!searches.includes(searchCity)) {
      searches.unshift(searchCity);
    }

    searches = searches.slice(0, 5);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(searches)
    );

    setRecentSearches(searches);
    setCity("");
    setSuggestions([]);
  };

  return (
    <section className="w-full flex justify-center mt-4 relative">
      {/* Wrapper same as table & cards */}
      <div className="w-full md:max-w-[960px] px-4 relative">
        {/* Input wrapper */}
        <div className="relative w-full">
          {/* Search Icon */}
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
            onKeyDown={(e) =>
              e.key === "Enter" && handleSearch()
            }
            className="
              w-full
              h-11 sm:h-12
              rounded-xl
              pl-10
              pr-4
              bg-[#26303B]
              border border-gray-700
              text-[16px] sm:text-base
              text-white
              placeholder-gray-400
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              [-webkit-text-size-adjust:100%]
            "
          />
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 left-0 w-full bg-[#26303B] border border-gray-700 rounded-xl overflow-hidden">
            {suggestions.map((s) => (
              <div
                key={s}
                onClick={() => handleSearch(s)}
                className="px-4 py-2 text-[16px] sm:text-base cursor-pointer text-white hover:bg-[#2F3A46]"
              >
                {s}
              </div>
            ))}
          </div>
        )}

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {recentSearches.map((c) => (
              <button
                key={c}
                onClick={() => handleSearch(c)}
                className="px-3 py-1 text-[16px] sm:text-sm rounded-lg bg-[#26303B] text-white hover:bg-[#2F3A46]"
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
