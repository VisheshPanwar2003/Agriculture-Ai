import {
  CloudSun,
  CloudRain,
  Cloud,
  Sun,
  Droplets,
  Wind,
  Loader2,
  MapPin,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useTranslation } from "../services/i18n";

export default function WeatherCard({
  city = "Delhi",
  onSettingsClick = () => {},
}) {
  const { t } = useTranslation();

  const [weather, setWeather] =
    useState(null);

  const [loadedCity, setLoadedCity] = useState(null);
  const [error, setError] = useState(null);
  const loading = loadedCity !== city && error?.city !== city;

  const fetchWeather = useCallback(async () => {
    const response = await api.get(`/weather/${encodeURIComponent(city)}`);
    return response.data;
  }, [city]);

  useEffect(() => {
    let active = true;

    fetchWeather()
      .then((data) => {
        if (active) {
          setWeather(data);
          setLoadedCity(city);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (active) {
          const isInvalidCity = requestError.response?.status === 404 ||
            requestError.response?.data?.code === "CITY_NOT_FOUND";
          setError({
            city,
            invalidCity: isInvalidCity,
            message: isInvalidCity
              ? t("Please enter the city correctly in Settings.")
              : t("Weather is temporarily unavailable. Please try again."),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [city, fetchWeather, t]);

  const currentError = error?.city === city ? error.message : "";

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
        {t("Weather")}
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

        ) : currentError ? (

          <div role="alert" className="rounded-xl border border-amber-300/15 bg-amber-300/[0.06] p-3">
            <div className="flex items-start gap-2 text-sm leading-relaxed text-amber-100">
              <MapPin size={16} className="mt-0.5 shrink-0 text-amber-300" />
              <span>{currentError}</span>
            </div>
            {error?.city === city && error.invalidCity && (
              <Link to="/settings" onClick={onSettingsClick} className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-amber-300 px-3 py-2 text-xs font-semibold text-[#17200f] transition hover:bg-amber-200">
                {t("Correct location")}
              </Link>
            )}
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
                  {t(weather.weather)}
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

                  <span>{t("Humidity")}</span>
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

                  <span>{t("Wind Speed")}</span>
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

                  <span>{t("Condition")}</span>
                </div>

                <span className="font-medium capitalize">
                  {t(weather.weather)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
