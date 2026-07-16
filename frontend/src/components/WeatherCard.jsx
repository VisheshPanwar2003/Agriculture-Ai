import {
  CloudSun,
  CloudRain,
  Cloud,
  Sun,
  Droplets,
  Wind,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

import api from "../services/api";

export default function WeatherCard({
  city = "Delhi",
}) {

  const [weather, setWeather] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchWeather();

  }, [city]);

  const fetchWeather = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        `/weather/${city}`
      );

      console.log(
        "Weather Response:",
        response.data
      );

      setWeather(response.data);

    } catch (err) {

      console.log(err);

      setError("Unable to load weather");

    } finally {

      setLoading(false);
    }


  };

  // WEATHER ICON
  const getWeatherIcon = () => {

    if (!weather || !weather.weather) {
      return (
        <CloudSun
          className="text-yellow-400"
          size={28}
        />
      );
    }

    const condition =
      weather.weather.toLowerCase();

    if (condition.includes("rain")) {
      return (
        <CloudRain
          className="text-blue-400"
          size={28}
        />
      );
    }

    if (condition.includes("cloud")) {
      return (
        <Cloud
          className="text-gray-300"
          size={28}
        />
      );
    }

    if (condition.includes("clear")) {
      return (
        <Sun
          className="text-yellow-400"
          size={28}
        />
      );
    }

    return (
      <CloudSun
        className="text-yellow-400"
        size={28}
      />
    );
  };

  return (
    <div className="w-full p-3">

      {/* TITLE */}
      <p
        className="
        text-[11px]
        uppercase
        tracking-widest
        text-green-400
        mb-2
        font-semibold
        "
      >
        Weather
      </p>

      {/* CARD */}
      <div
        className="
        bg-[#08251c]
        border
        border-[#12392d]
        rounded-2xl
        p-4
        shadow-lg
        text-white
        "
      >

        {loading ? (

          <div
            className="
            flex
            items-center
            justify-center
            py-8
            "
          >
            <Loader2
              className="animate-spin text-green-400"
              size={26}
            />
          </div>

        ) : error ? (

          <div className="text-red-400 text-sm">
            {error}
          </div>

        ) : (

          <>
            {/* TOP */}
            <div className="flex items-center gap-3">

              <div
                className="
                w-12
                h-12
                rounded-xl
                bg-[#0d3328]
                flex
                items-center
                justify-center
                "
              >
                {getWeatherIcon()}
              </div>

              <div>
                <h2
                  className="
                  text-3xl
                  font-bold
                  leading-none
                  "
                >
                  {Math.round(weather.temperature)}°C
                </h2>

                <p
                  className="
                  text-sm
                  text-gray-300
                  mt-1
                  capitalize
                  "
                >
                  {weather.weather}
                </p>

                <p
                  className="
                  text-xs
                  text-gray-500
                  "
                >
                  {weather.city}, India
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="mt-5 space-y-3">

              <div
                className="
                flex
                items-center
                justify-between
                text-sm
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  text-gray-300
                  "
                >
                  <Droplets
                    size={16}
                    className="text-cyan-400"
                  />

                  <span>Humidity</span>
                </div>

                <span className="font-medium">
                  {weather.humidity}%
                </span>
              </div>

              <div
                className="
                flex
                items-center
                justify-between
                text-sm
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  text-gray-300
                  "
                >
                  <Wind
                    size={16}
                    className="text-blue-400"
                  />

                  <span>Wind Speed</span>
                </div>

                <span className="font-medium">
                  {weather.wind_speed} km/h
                </span>
              </div>

              <div
                className="
                flex
                items-center
                justify-between
                text-sm
                "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  text-gray-300
                  "
                >
                  <CloudRain
                    size={16}
                    className="text-green-400"
                  />

                  <span>Condition</span>
                </div>

                <span className="font-medium capitalize">
                  {weather.weather}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
