// These variables are declared when creating a node project.
const express = require('express');
const router = express.Router();

// Accesses the config data in the config file – this is where api keys live and other important data that shouldn't be shared.
const CONFIGDATA = require('../config/configData');

// A package that performs async/await promises on an API call
const fetch = require('node-fetch');

// Variable that will hold the geolocation data below in GET route – placed here so it's accessible from anywhere in this file. The data
// from this file will be rendered in the POST route below.
let geolocation;

/* GET home page. */
// Making a call to the API that gets the user's geolocation, the cleanReturnValue is the json formatting of the api call.
// Setting values for 'geolocation' object – grabs the user's zip code and country code (2 digit country code – i.e. 'US') to render in .POST if user allows gps tracking.
router.get('/', async (req, res, next) => {
    const response = await fetch(CONFIGDATA.geolocationConfig.url);
    const cleanReturnValue = await response.json();
    geolocation = {
        zipCode: cleanReturnValue.zip_code,
        countryCode: cleanReturnValue.country_code,
    };
    res.render('index', { title: `Today's weather` });
});

/* POST method – hitting the API with some data and getting values back */
router.post('/',async (req, res, next) => {
    // grabWeatherData is making the API request to grab the weather data, 'cleanReturnValue' is the data returned parsed into JSON.
    const grabWeatherData = async (value) => {
        const response = await fetch(CONFIGDATA.weatherConfig.url + value + CONFIGDATA.weatherConfig.units + `&appid=${CONFIGDATA.weatherConfig.key}`);
        const cleanReturnValue = await response.json();
        return cleanReturnValue;
    };

    /* input:
            - if the user enters text in "city" textbox, then grab that data and put it into query call;
            - else, if the user enters the zip code, grab that data and attached 2 digit country code 'US'
              (this is how the api queries using zipcode –– from the docs: api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={API key})
     */
    const input = (req.body.city ? `?q=${req.body.city}` : `?q=${req.body.zip},US`);

    /* location:
            - if the user clicks the button 'Yes, access my location', then set up the query to use the zip code and country code grabbed in the GET method above.
            - else, use the data from 'input' variable declared above.
     */
    const location = (req.body.use_gps ? `?q=${geolocation.zipCode},${geolocation.countryCode}` : input);

    // Performing the actual API call and using promises while we grab the data (.then). Passing in the location variable above which will holds the query for the API.
    grabWeatherData(location)
        .then(returnedData => {
            // Object that holds all desired data from the API call to be rendered in the template (view).
            // To see what the API call returns fully, run: console.log(returnedData);
            const data = {
                city: returnedData.name,
                weather: returnedData.weather,
                actualTemp: returnedData.main.temp,
                feelsLikeTemp: returnedData.main.feels_like,
            };

            // Any variables passed into `res.render` can be accessed in the template (view) – index.pug in this case.
            res.render('index', {
                title: "Today's weather",             // Title to be rendered on the page
                data,                                 // data object from above – this is short-hand for data: data
                showResult: location ? true : false,  // Acts as a 'flag' – will only show results on the page when form is submitted with data.
            });
        })
        // When there's an error it will be caught here and rendered in the view (index.pug) since showError is true.
        .catch(error => {
            res.render('index', { title: "Today's weather", errorMessage: error.message, showError: true });
        });
});
module.exports = router;
