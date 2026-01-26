import { useState, useEffect } from "react";

export default function Search({ onSearch }) {
  const [city, setCity] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
      setRecentSearches(searches);
    }, 0);
  }, []);

  const handleSearch = (searchCity = city) => {
    if (searchCity.trim() === "") return;

    onSearch(searchCity);

    let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (!searches.includes(searchCity)) {
      searches.unshift(searchCity);
    }
    searches = searches.slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    setRecentSearches(searches);
    setCity("");
  };

  return (
    <div className="flex flex-col items-center mt-2 px-4">
      <div className="relative w-full max-w-xl">
        {/* Search icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
          type="text"
          placeholder="Search for a city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {recentSearches.map((c) => (
            <button
              key={c}
              onClick={() => handleSearch(c)}
              className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600 text-sm"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
