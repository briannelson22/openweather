import express from 'express';
import asyncify from 'express-asyncify';
import dotenv from 'dotenv-flow';
import log4js from 'log4js';
import { getWeather } from './openweatherUtils.js';

dotenv.config();

const { EXPRESS_PORT } = process.env;
log4js.configure('./log4js.json');
const logger = log4js.getLogger();

// TODO: Add swagger api

const app = asyncify(express());

app.get(
  '/weather',
  async (request, response) => {
    logger.trace('get /weather');
    response.send(await getWeather(
      request.query.lat,
      request.query.lon,
    ));
  },
);

app.listen(
  EXPRESS_PORT,
  () => {
    logger.info(`Example app listening on port ${EXPRESS_PORT}`);
  },
);
