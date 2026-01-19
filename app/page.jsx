import Header from "@/components/Header";
import Search from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import WeatherStats from "@/components/WeatherStats";
import ForecastTable from "@/components/ForecastTable";
import Footer from "@/components/Footer";

const sampleDays = [
  {
    date: "2026-01-19",
    highF: 78,
    lowF: 65,
    conditionText: "Partly Cloudy",
    iconSrc: "/icons/PartlyCloudy.png",
  },
  {
    date: "2026-01-20",
    highF: 80,
    lowF: 68,
    conditionText: "Sunny",
    iconSrc: "/icons/sun.png",
  },
  {
    date: "2026-01-21",
    highF: 75,
    lowF: 62,
    conditionText: "Rainy",
    iconSrc: "/icons/Rainy.png",
  },
  {
    date: "2026-01-22",
    highF: 72,
    lowF: 60,
    conditionText: "Cloudy",
    iconSrc: "/icons/PartlyCloudy.png",
  },
  {
    date: "2026-01-23",
    highF: 77,
    lowF: 64,
    conditionText: "Sunny",
    iconSrc: "/icons/sun.png",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-b from-black to-gray-900 text-slate-50 flex flex-col">
      <Header />

      <div className="flex-1 w-full">
        <div className="max-w-5xl mx-auto w-full px-4">
          <Search />

          <CurrentWeather
            city="Amman"
            country="Jordan"
            condition="sun"
            description="Mostly clear with a high of 75°F"
          />

          <WeatherStats humidity={60} windMph={5} feelsLikeF={72} />
          <ForecastTable days={sampleDays} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
