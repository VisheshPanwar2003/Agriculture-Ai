const WeatherService =
  require("../services/weatherService");

const weatherService =
  new WeatherService(
    process.env.WEATHER_API_KEY
  );

exports.getWeather =
  async (req, res) => {

    try {

      const result =
        await weatherService
          .getWeatherByCity(
            req.params.city
          );

      res.json(result);

    } catch (err) {
      const providerStatus = err.response?.status;
      const invalidCity = providerStatus === 400 || providerStatus === 404 ||
        Number(err.response?.data?.cod) === 404;

      if (invalidCity) {
        return res.status(404).json({
          code: "CITY_NOT_FOUND",
          error: "City not found. Please enter the city correctly in Settings.",
        });
      }

      res.status(502).json({
        error: "Weather data is temporarily unavailable. Please try again later.",
      });
    }
  };
