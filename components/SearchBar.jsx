"use client";

import { useState, useEffect, useRef } from "react";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export default function Search({ onSearch }) {
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
      console.error("Failed to fetch city suggestions:", err);
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
      // لو ما في اقتراحات → نخلي parent يعرض رسالة "Not Found"
      onSearch(null); // مهم! خلي الـ parent يتحقق إذا null → ما يعرض بيانات
      setCity("");
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    onSearch(searchCity);

    // حفظ recent searches
    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (!searches.includes(searchCity)) searches.unshift(searchCity);
    searches = searches.slice(0, 5);
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
      <div className="w-full px-4 md:max-w-[960px] mx-auto relative">
        <div className="relative w-full">
          {/* أيقونة البحث */}
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

          {/* حقل الإدخال */}
          <input
            style={{ fontFamily: "var(--font-space)" }}
            type="text"
            placeholder="Search for a city"
            value={city}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="
              w-full
              h-12
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

          {/* قائمة الاقتراحات */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 z-50 bg-[#26303B] border border-gray-700 rounded-xl overflow-hidden">
              {suggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="px-4 py-3 text-white hover:bg-[#2F3A46] cursor-pointer text-[16px] sm:text-base"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {recentSearches.map((c) => (
              <button
                key={c}
                onClick={() => handleSearch(c)}
                className="px-3 py-1 text-[16px] sm:text-sm rounded-lg bg-[#26303B] text-white hover:bg-[#2F3A46]"
              >
                {c}
              </button>
            ))}
            <button
              onClick={handleClearHistory}
              className="px-3 py-1 text-[16px] sm:text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
