const axios =
  require("axios");

class WeatherService {

  constructor(apiKey) {

    this.apiKey = apiKey;

    this.baseURL =
      "https://api.openweathermap.org/data/2.5/weather";
  }

  async getWeatherByCity(
    city
  ) {

    const response =
      await axios.get(
        this.baseURL,
        {
          params: {
            q: city,
            appid:
              this.apiKey,
            units:
              "metric",
          },
        }
      );

    const data =
      response.data;

    return {

      city:
        data.name,

      temperature:
        data.main.temp,

      humidity:
        data.main.humidity,

      weather:
        data.weather[0]
          .description,

      wind_speed:
        data.wind.speed,

      timestamp:
        new Date(),
    };
  }
}

module.exports =
  WeatherService;