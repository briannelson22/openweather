import axios from 'axios';
import log4js from 'log4js';
import assert from 'assert';
import isNumber from 'is-number';
import stringify from 'fast-stringify';

const OPENWEATHER_ONECALL_URI = 'https://api.openweathermap.org/data/2.5/onecall';
const logger = log4js.getLogger();

/**
 * Return hot, cold, or moderate based on a temperature
 * >= 90.0 - hot
 * >= 70.0 - moderate
 * default - cold
 * @param temp {Number} The numeric temperature
 * @returns {string} A textual description...hot, moderate, or cold
 */
export const mapTempToDescription = (temp) => {
  assert.ok(
    isNumber(temp),
    'Invalid temp parameter',
  );
  if (temp >= 90.0) {
    return 'hot';
  }
  if (temp >= 70.0) {
    return 'moderate';
  }
  return 'cold';
};

const simplifyResponse = (response) => ({
  status: response.status,
  statusText: response.statusText,
  data: response.data,
  headers: response.headers,
});

/**
 * Given a latitude and longitude return the current weather report for that location
 *
 * @param lat {number} Latitude of the location to retrieve weather report for
 * @param lon {number} Longitude of the location to retrieve weather report for
 * @returns {Promise{forecast: string, temp: string, alerts: string}}
 */
export const getWeather = async (
  lat,
  lon,
) => {
  assert.ok(
    isNumber(lat),
    'Invalid lat parameter',
  );
  assert.ok(
    isNumber(lon),
    'Invalid lon parameter',
  );
  logger.trace(`enter getWeather:
    lat: ${lat}
    lon: ${lon}
  `);

  try {
    const openWeatherResponse = await axios.get(
      OPENWEATHER_ONECALL_URI,
      {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_API_KEY,
          exclude: 'minutely,hourly,daily',
          units: 'imperial',
        },
        responseType: 'json',
      },
    );
    logger.trace(`openWeatherResponse: ${stringify(simplifyResponse(openWeatherResponse), null, 2)}`);
    const { data } = openWeatherResponse;

    if (!data.current.weather[0]) {
      throw new Error('No weather information returned');
    }

    const forecast = data.current?.weather[0]?.description;
    if (!forecast) {
      throw new Error('No forecast description returned');
    }

    const tempFromOpenWeather = data.current?.temp;
    if (!tempFromOpenWeather) {
      throw new Error('No temp returned');
    }

    return {
      forecast,
      temp: data.current ? mapTempToDescription(data.current.temp) : '',
      alerts: data.alerts?.map((row) => row.description) ?? [],
    };
  } catch (err) {
    logger.trace(`error retrieving openweather onecall: ${stringify(err)}`);
    throw err;
  }
};
