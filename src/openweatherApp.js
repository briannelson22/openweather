/**
 * Express server for weather information
 */
import express from 'express';
import asyncify from 'express-asyncify';
import dotenv from 'dotenv-flow';
import log4js from 'log4js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// eslint-disable-next-line import/extensions
import { getWeather } from './openweatherUtils.js';

dotenv.config();

const { EXPRESS_PORT } = process.env;
log4js.configure('./log4js.json');
const logger = log4js.getLogger();

const app = asyncify(express());

/**
 * @openapi
 *
 * /weather:
 *   get:
 *     summary: Retrieve the weather report for a given latitude & longitude.
 *     description: Retrieve the weather report for a given latitude & longitude.
 *       Takes the latitude(lat) and longitude(lon) in parameters.
 *       Returns a json object containing the current weather information for the location.
 *     responses:
 *       200:
 *         description: Weather information object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forecast:
 *                   type: string
 *                 temp:
 *                   type: string
 *                   enum: [hot, moderate, cold]
 *                 alerts:
 *                   type: array
 *                   items:
 *                     type: string
 *   produces:
 *      - application/json
 *   parameters:
 *     - name: lat
 *       description: The latitude to retrieve the current weather for.
 *       in: query
 *       schema:
 *         type: number
 *       required: true
 *       examples:
 *         Fargo:
 *           value: 46.8772
 *           summary: Latitude for Fargo, ND
 *     - name: lon
 *       description: The longitude to retrieve the current weather for.
 *       in: query
 *       schema:
 *         type: number
 *       required: true
 *       examples:
 *         Fargo:
 *           value: 96.7898
 *           summary: Longitude for Fargo, ND
  */
app.get(
  '/weather',
  async (request, response) => {
    logger.trace('get /weather');
    response.json(await getWeather(
      request.query.lat,
      request.query.lon,
    ));
  },
);

const swaggerBaseDefinition = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Weather Assignment',
    description: 'Welcome to the the weather api assignment. This api uses the openweather api to return information about the current weather.',
    contact: {
      name: 'Brian Nelson',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [{
    url: `http://localhost:${process.env.EXPRESS_PORT}`,
  }],
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

const openapiSpecification = swaggerJsdoc({
  definition: swaggerBaseDefinition,
  apis: ['./src/openweatherApp.js'],
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiSpecification, { explorer: false }),
);

app.listen(
  EXPRESS_PORT,
  () => {
    logger.info(`Example app listening on port ${EXPRESS_PORT}`);
  },
);
