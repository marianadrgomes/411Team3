const express = require('express');
const router = express.Router();
const db = require('../mongoConnection');

// A package that performs async/await promises on an API call
const fetch = require('node-fetch');

// Accesses the config data in the config file – this is where api keys live and other important data that shouldn't be shared.
const CONFIGDATA = require('../config/configData');
const LOGIC = require('../weather_to_mood/logic');
// contains the configuration for doing spotify authorization
let spotifyConfig = CONFIGDATA.spotifyConfig;
let playlistConfig = CONFIGDATA.playlistConfig;

// Global variables
let geolocation;    /* Variable that will hold the geolocation data below in GET route – placed here so it's accessible from anywhere in this file. The data *
                     * from this file will be rendered in the POST route below.                                                                              */

let accessToken;    // Variable that will contain the spotify access token that will be used as a parameter for spotify API calls
let results;        // This holds the database contents
let locationInput;  // Will hold user's location data, either from DB or geolocation
let playListData;   // Will hold spotify playlist data




/* GET home page. */
router.get('/',  async (req, res, next) => {
    /* This grabs the data from `welcome.js` using `req.app.set` – it basically grabs the data off of the form used to sign in/sign up  *
     * and passes it here so we can find the user in the database (below in this same route)                                            */
    let userDataFromWelcomePage = req.app.get('user');

    // Getting geolocation
    const response = await fetch(CONFIGDATA.geolocationConfig.url);
    const cleanReturnValue = await response.json();
    geolocation = {
        zipCode: cleanReturnValue.zip_code,
        countryCode: cleanReturnValue.country_code,
    };

    // Getting stuff from DB based on email
    let mongo = await db.getDB('411');
    results = await mongo.collection('users').find({ email: userDataFromWelcomePage.email }).toArray();

    // Rendering to home.pug template
    res.render("home", { data: results });
});

/* POST method – hitting the APIs with some data and getting values back */
router.post('/', async (req, res, next) => {
    // grabWeatherData is making the API request to grab the weather data, 'cleanReturnValue' is the data returned parsed into JSON.
    const grabWeatherData = async (value) => {
        const response = await fetch(CONFIGDATA.weatherConfig.url + value + CONFIGDATA.weatherConfig.units + `&appid=${CONFIGDATA.weatherConfig.key}`);
        const cleanReturnValue = await response.json();
        return cleanReturnValue;
    };

    // making API call to Spotify to acquire access token, we have to provide the access token to Spotify when we call the search playlist API
    const getAccessToken = async () => {
        const response = await fetch(spotifyConfig.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' +
                    (Buffer.from(spotifyConfig.client_ID + ':' + spotifyConfig.client_secret).toString('base64'))
            },
            body: new URLSearchParams('grant_type=client_credentials')
        })
        const data = await response.json();
        return data;
    }

    // making API call to spotify to retrieve playlist
    const getPlayList = async (id, accessToken) => {
        const mood = LOGIC.return_rd_mood(id);
        //console.log(mood);
        const response = await fetch(playlistConfig.url + "?q=" + mood + "&type=playlist", { // mood is currently hardcoded, need to change later
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });
        const data = await response.json();
        return data;
    }

    // Method to load the database with spotify data
    const loadDbWithSpotifyPlaylist = async (userEmail, name, url, image) => {
        // Load spotify playlist data into user's database
        let mongo = await db.getDB('411');
        let update = await mongo.collection('users').updateOne( { email: userEmail }, { $push: { spotifyData: { name, url, image } }});
    }

    /* Getting location input – the first condition grabs data stored in database if the user   *
     * clicks button to use stored data. Otherwise, if they choose to use GPS coordinates, then *
     * we'll use the data generated for geolocation in the GET route above.                     */
    if (req.body.stored_location) { locationInput = `?q=${results[0].city}`; }
    else if (req.body.use_gps) { locationInput = `?q=${geolocation.zipCode},${geolocation.countryCode}`; }

    // Performing API call to get weather data
    grabWeatherData(locationInput)
        .then(returnedWeatherData => {
            // Object that holds all desired data from the API call to be rendered in the template (view).
            // To see what the API call returns fully, run: console.log(returnedWeatherData);
            const weatherData = {
                city: returnedWeatherData.name,
                weather: returnedWeatherData.weather,
                weather_id: returnedWeatherData.weather[0].id,
                actualTemp: returnedWeatherData.main.temp,
                feelsLikeTemp: returnedWeatherData.main.feels_like,
            };

            // performing API call to get access token
            getAccessToken()
                .then(returnedAccessToken => {
                    // once we got the access token, call the search API to retrieve the playlist
                    accessToken = returnedAccessToken.access_token;
                    getPlayList(weatherData.weather_id, accessToken)
                        .then(returnedPlaylistData => {
                         playListData = {
                            name: returnedPlaylistData.playlists.items[0].name,
                            url: returnedPlaylistData.playlists.items[0].external_urls.spotify,
                            image: returnedPlaylistData.playlists.items[0].images[0].url,
                        }

                        // Loading the database with spotify data
                        loadDbWithSpotifyPlaylist(
                            results[0].email,
                            playListData.name,
                            playListData.url,
                            playListData.image
                        );

                         // Rendering to home.pug template
                        res.render('home', {
                            data: results,
                            weatherData,    // data object from above – this is short-hand for weatherData: weatherData
                            playListData,
                            showPlayList: returnedPlaylistData.playlists.items.length > 0, // if the response contains at least one playlist, display the result
                            showResult: locationInput ? true : false,  // Acts as a 'flag' – will only show results on the page when form is submitted with data.
                        });

                        }).catch(error => { res.render('home', { title: "Today's weather", errorMessage: error.message, showError: true }); })
                }).catch(error => { res.render('home', { title: "Today's weather", errorMessage: error.message, showError: true }); });
        }).catch(error => { res.render('home', { title: "Today's weather", errorMessage: error.message, showError: true }); });
});

module.exports = router;
