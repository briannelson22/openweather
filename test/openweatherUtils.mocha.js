import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { config } from 'dotenv-flow';
import log4js from 'log4js';
import Chance from 'chance';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { getWeather, mapTempToDescription } from '../src/openweatherUtils.js';

const chance = new Chance();
chai.use(chaiAsPromised);
config();
log4js.configure('./log4js.json');

let mock;
const LAT_GOOD = 33.44;
const LAT_BAD = 'invalid';
const LON_GOOD = -94.04;
const LON_BAD = 'invalid';

const RESPONSE_GOOD = {
  status: 200,
  statusText: 'OK',
  data: {
    lat: 46.8772,
    lon: 96.7898,
    timezone: 'Asia/Hovd',
    timezone_offset: 25200,
    current: {
      dt: 1643236611,
      sunrise: 1643245430,
      sunset: 1643279215,
      temp: -15.48,
      feels_like: -28.08,
      pressure: 1044,
      humidity: 75,
      dew_point: -20.54,
      uvi: 0,
      clouds: 2,
      visibility: 10000,
      wind_speed: 6.15,
      wind_deg: 73,
      wind_gust: 5.46,
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01n',
        },
      ],
    },
  },
  headers: {
    server: 'openresty',
    date: 'Wed, 26 Jan 2022 22:36:51 GMT',
    'content-type': 'application/json; charset=utf-8',
    'content-length': '392',
    connection: 'close',
    'x-cache-key': '/data/2.5/onecall?exclude=minutely,hourly,daily&lat=46.88&lon=96.79&units=imperial',
    'access-control-allow-origin': '*',
    'access-control-allow-credentials': 'true',
    'access-control-allow-methods': 'GET, POST',
  },
};

describe('openweatherUtils', () => {
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('getWeather()', () => {
    it('should error out on invalid lat', async () => {
      await expect(getWeather(LAT_BAD, LON_GOOD)).to.be.rejectedWith('Invalid lat parameter');
    });
    it('should error out on invalid lon', async () => {
      await expect(getWeather(LAT_GOOD, LON_BAD)).to.be.rejectedWith('Invalid lon parameter');
    });
    it('Valid lat & lon return a result', async () => {
      mock.onGet().reply(200, RESPONSE_GOOD.data);
      await expect(getWeather(LAT_GOOD, LON_GOOD)).to.be.fulfilled;
    });
    it('Throws when openweather returns 404', async () => {
      mock.onGet().reply(404, RESPONSE_GOOD.data);
      await expect(getWeather(LAT_GOOD, LON_GOOD)).to.be.rejectedWith('Request failed with status code 404');
    });
    it('Throws when openweather data missing temp', async () => {
      mock.onGet().reply(200, {
        current: {
          weather: [{
            description: 'Weather description',
          }],
          temp: undefined,
        },
        alerts: [],
      });
      await expect(getWeather(LAT_GOOD, LON_GOOD)).to.be.rejectedWith('No temp returned');
    });
    it('Throws when openweather data missing description', async () => {
      mock.onGet().reply(200, {
        current: {
          weather: [{
            description: undefined,
          }],
          temp: 32.0,
        },
        alerts: [],
      });
      await expect(getWeather(LAT_GOOD, LON_GOOD)).to.be.rejected;
    });
    it('Does not throw when openweather data missing alerts', async () => {
      mock.onGet().reply(200, {
        current: {
          weather: [{
            description: 'description',
          }],
          temp: 32.0,
        },
        alerts: undefined,
      });
      await expect(getWeather(LAT_GOOD, LON_GOOD)).to.be.fulfilled;
    });
  });

  describe('mapTempToDescription', () => {
    it('hot', async () => {
      for (let i = 0; i < 100; i = i + 1) {
        const temp = chance.floating({ min: 90.0, fixed: 2 });
        expect(mapTempToDescription(temp)).to.equal('hot');
      }
    });
    it('moderate', async () => {
      for (let i = 0; i < 100; i = i + 1) {
        const temp = chance.floating({ min: 70.0, max: 89.9, fixed: 2 });
        expect(mapTempToDescription(temp)).to.equal('moderate');
      }
    });
    it('cold', async () => {
      for (let i = 0; i < 100; i = i + 1) {
        const temp = chance.floating({ max: 69.9, fixed: 2 });
        expect(mapTempToDescription(temp)).to.equal('cold');
      }
    });
  });
});
