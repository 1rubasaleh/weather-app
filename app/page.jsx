"use client"; //Client Component: This means it works in the browser, not on the server. We use it when using useState and useEffect.

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Search from "@/components/SearchBar";
import WeatherStats from "@/components/WeatherStats";
import Footer from "@/components/Footer";
import ForecastTable from "@/components/ForecastTable";
import CurrentWeather from "@/components/CurrentWeather";
import { getIconSrc } from "@/lib/weatherIcons";
// API Key
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
//Skeleton (Loading placeholder):This placeholder appears while data is being loaded.
//animate-pulse → Animate the gray boxes to make them appear as if they are loading skeleton.
//Its benefit: It gives the user the feeling that the page is loading, instead of being empty.
function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 mt-6">
      <div className="h-8 bg-gray-700 rounded w-1/3 mx-auto" />
      <div className="h-32 bg-gray-700 rounded mx-auto max-w-xl" />
      <div className="h-20 bg-gray-700 rounded mx-auto max-w-5xl" />
    </div>
  );
}

// MAIN PAGE
export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");

  //fetchWeather function (fetch weather by city name)
  //We start a new load each time we search for a city.
  //We clear any old error messages.
  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        //We are making an API request to fetch the current weather for the city.
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();

      //We save all the important data in state weather.
      //iconSrc → We use getIconSrc to convert text into an icon.
      setWeather({
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        iconSrc: getIconSrc(data.weather[0].description),
        humidity: data.main.humidity,
        windMph: data.wind.speed,
        feelsLikeC: data.main.feels_like,
      });
      //Fetch forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
      );
      if (!forecastRes.ok) throw new Error("Forecast not available");
      const forecastData = await forecastRes.json();
      // Collect data for each day.
      //item.dt_txt.split(" ")[0] → We take only the date, not the time.
      //We save all temperatures and conditions for each day.
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
      //We calculate the highest and lowest temperatures for each day.
      //We store them in the state forecast.
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
      //If an error occurs, save it to the error folder and delete any old data.
      //Finally, stop loading.
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  //Retrieve by location (geolocation)
  //Once the page loads, we try to get the user's location.
  //If there's no geolocation, we display Amman as the default.
  //`getCurrentPosition` returns `lat` and `lon`, which we then pass to the `fetchWeatherByCoords` function.
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather("Amman");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        fetchWeather("Amman");
      },
    );
  }, []);
  //The same concept as fetchWeather, but based on coordinates (lat, lon) instead of the city name.
  //We call it if the user allows access to their location.
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-slate-50 flex flex-col">
      <Header unit={unit} setUnit={setUnit} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4">
        {/*When the user types the name of a city, onSearch calls up fetchWeather.*/}
        <Search onSearch={fetchWeather} />{" "}
        {/*If it's loading → we display the message Loading + Skeleton.*/}
        {loading && (
          <div className="text-center">
            <p className="text-sm text-slate-400">
              Loading your location & weather...
            </p>
            <Skeleton />
          </div>
        )}
        {/*If an error occurs → we display a message in red.*/}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        <div
          className={`transition-opacity duration-500 ${loading ? "opacity-50" : "opacity-100"}`}
        >
          {/*If you return the weather data → we display CurrentWeather.
          Here, it's important to use the weather && clause to avoid crashes. */}
          {weather && (
            <CurrentWeather
              city={weather.city}
              country={weather.country}
              description={weather.description}
            />
          )}
        </div>
        {/*After loading is complete and the weather data is available → we display the weather statistics.*/}
        {weather && !loading && (
          <WeatherStats
            humidity={weather.humidity}
            windMph={weather.windMph}
            feelsLikeC={weather.feelsLikeC}
            unit={unit}
          />
        )}
        {/*If in forecast → we display the expected weather.*/}
        {forecast.length > 0 && !loading && (
          <ForecastTable days={forecast} unit={unit} />
        )}
      </div>

      <Footer />
    </main>
  );
}
