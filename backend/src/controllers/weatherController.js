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

      res.status(500).json({
        error:
          err.message,
      });
    }
  };