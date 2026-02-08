import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

/* ✅ METADATA GOES HERE */
export const metadata = {
  title: "Weather App",
  description:
    "A modern weather application providing real-time conditions and a detailed 5-day forecast. Search any city worldwide and get accurate, easy-to-read weather insights.",
  keywords: ["weather", "forecast", "temperature", "Next.js"],

  icons: {
    icon: "/icon.ico",
  },

  openGraph: {
    title: "Weather App",
    description:
      "Check the weather in any city around the world with real-time data and a detailed 5-day forecast.",
    siteName: "Weather App",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${spaceGrotesk.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
