import express  from 'express';
import axios from 'axios';

// TODO: Create git repo & check in
// TODO: env flow
// TODO: Put key in .env
// TODO: Log4js
// TODO: Add mocha
// TODO: Restrict content types
// TODO: Add swagger api

const app = express();
const port = 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_ONECALL_URI = 'https://api.openweathermap.org/data/2.5/onecall';

{
    a: 'snow, rain, etc',
    b: 'hot,cold, or moderate',
    alerts: [],
}

const getWeather = async (
    lat,
    lon,
) => {
    // TODO: Verify lat is correct data type
    // TODO: Verify lon is correct data type

    const openWeatherResponse  = await axios.get(
        OPENWEATHER_ONECALL_URI,
        {
            params: {
                lat,
                lon,
                appid: OPENWEATHER_API_KEY,
                exclude: [
                    'minutely',
                    'hourly',
                    'daily',
                ]
            }
        },
    );
}

app.get(
    '/',
    (request, response) => {
        response.send('Hello World');
    },
);

app.listen(
    port,
    () => {
        console.log(`Example app listening on port ${port}`)
    }
)