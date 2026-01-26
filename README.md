# Weather App – Internship Project

## Live Demo

[Weather App Live](https://weather-app-ruby-ten-92.vercel.app/)

## Tech Stack

- **Frontend:** Next.js 16 + Tailwind CSS
- **API:** OpenWeatherMap (Current weather + 5-day forecast)
- **Hosting / Deployment:** Vercel
- **Other Tools:** LocalStorage (recent searches), Geolocation API

## Features Implemented

### Must-Have Features

1. **UI from Figma**
   - Top header with title + unit toggle (°C ↔ °F)
   - Search bar with input + search icon
   - Current city weather display (City, Country, Description, Icon)
   - 3 Stat Cards: Humidity, Wind, Feels Like
   - 5-day forecast table with weather icons
   - Footer

2. **Responsive Design**
   - Mobile, Tablet, Desktop layouts tested
   - Cards stack nicely on small screens
   - Forecast table remains readable on all breakpoints

3. **Weather API Integration**
   - Fetches live data from OpenWeatherMap
   - Handles city search input dynamically
   - Fetches 5-day forecast
   - Shows temperature, description, humidity, wind, feels like

4. **UX States**
   - Loading skeleton while fetching data
   - Error messages if city not found or API fails
   - Friendly empty state before search

5. **Git & GitHub**
   - Repository on GitHub with proper commit history

### Bonus / Extra Features

- Unit toggle works (°C ↔ °F)
- Geolocation API fetches current location weather
- Recent searches saved in LocalStorage
- Smooth transitions / loading skeletons
- Accessible input (Enter key triggers search)

## Environment Variables

Create a `.env.local` file at the root of the project:
