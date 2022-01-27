<h1>Assignment</h1>
<p>
Write an http server that uses the Open Weather API that exposes an endpoint that takes in lat/longcoordinates.  This endpoint should return what the weather condition is outside in that area (snow, rain,etc), whether it’s hot, cold, or moderate outside (use your own discretion on what temperature equates toeach type), and whether there are any weather alerts going on in that area, with what is going on if thereis currently an active alert.  The API can be found here: https://openweathermap.org/api.  The one-call apireturns all of the data while the other apis are piece-mealed sections.  You may also find thehttps://openweathermap.org/faq useful.
</p>

<h1>Running The Server</h1>
<ol>
<li>
Set the OPENWEATHER_API_KEY environment variable. You can either do this on the command line, or by adding it to the .env(or .env.local) file in the root of the project. See https://github.com/kerimdzhanov/dotenv-flow#readme for more information on setting environment variables.
</li>
<li>
Run 'npm install'
</li>
<li>
Run 'npm run start'
</li>
<li>
Open your browser to http://localhost:3000/api-docs to view the swagger docs and test out the api.
</li>
</ol>