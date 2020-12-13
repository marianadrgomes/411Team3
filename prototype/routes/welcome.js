//Author: Mariana Gomes, Zeyu Gu
const express = require('express');
const router = express.Router();
const db = require('../mongoConnection');
const twitterConfig = require('../config/configData.js').twitterConfig;
const oauth = require('oauth').OAuth
let results;

const oa = new oauth(
    twitterConfig.REQ_TOKEN_URL,
    twitterConfig.ACCESS_TOKEN_URL,
    twitterConfig.CONSUMER_KEY,
    twitterConfig.CONSUMER_SECRET,
    twitterConfig.OAUTH_VERSION,
    twitterConfig.CALLBACK_URL,
    twitterConfig.ALGORITHM
)


/* GET home page. This basically is set here to just grab the welcome.pug template and render it. */
router.get('/',  (req, res, next) => {
    res.render("welcome");
});

/* Getting sign in endpoint and rendering the signIn.pug template. */
router.get('/signIn', (req, res, next) => {
    res.render("signIn")
});

/* POST method responding to the form in signIn.pug. */
router.post('/signIn', async (req, res, next) =>{
    // Opening database connection
    let mongo = await db.getDB('411');

    // Checking if the email and password combination is in the database
    results = await mongo.collection('users').find({ email: req.body.email, password: req.body.password }).toArray();

    // if it's not, render error. if it is, redirect to /home page
    if (!results.length) {
        let errorMessage;
        if (!req.body.password) { errorMessage = "Please enter your password"; }
        else if (!req.body.email) { errorMessage = "Please enter your email address"; }
        else { errorMessage = "Wrong login information"; }
        res.render('signIn', { error: errorMessage, renderError: true }); }
    else {
        req.app.set('user', req.body)
        res.redirect('/home');
    }
});

/* Getting sign up endpoint and rendering the signUp.pug template. */
router.get('/signUp', (req, res, next) => {
    res.render("signUp")
});

/* POST method responding to the form in signUp.pug. */
router.post('/signUp', async (req, res, next) =>{
    /* Check if any of the inputs are empty, as there is data we *
     *        need to successfully generate weather data.        */
    let errorMessages = [];
    if (!req.body.firstName) { errorMessages.push("Please enter your first name"); }
    if (!req.body.lastName) { errorMessages.push("Please enter your last name"); }
    if (!req.body.city) { errorMessages.push("Please enter your city, we need it to get the weather in your location!"); }
    if (!req.body.zipCode) { errorMessages.push("Please enter your zip code, we need it to get the weather in your location!"); }
    if (!req.body.email) { errorMessages.push("Please enter an email address"); }
    if (!req.body.password) { errorMessages.push("Please enter a password"); }

    /* First, we check if there are any error messages. If there are then render them on    *
     * the same page (the signUp page). If there are no errors it means we can successfully *
     * upload the entered data into the database.                                           */
    if (errorMessages.length > 0) { res.render('signUp', { error: errorMessages, errorCount: errorMessages.length, renderError: true }); }
    else {
        // Opening database connection
        let mongo = await db.getDB('411');
        // Inserting the user's data and an empty spotify array so we can load it in "home.js"
        results = await mongo.collection('users').insert({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            addressLine: req.body.addressLine,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            email: req.body.email,
            password: req.body.password,
            spotifyData: [],
        });
        req.app.set('user', req.body)
        res.redirect('/home');
    }
});

router.get('/auth', (req, res, next) => {
    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log(error)
        }
        else {
            //Put the token and secret on the session, then redirect the user's browser
            //to Twitter so that they can log in and authorize this request token
            req.session.oauth = {};
            req.session.oauth.token = oauth_token;
            req.session.oauth.token_secret = oauth_token_secret;


            //User is sent to Twitter here...oauth_token is an UNAUTHORIZED Request token
            //to be authorized by the user as part of logging in to Twitter. You can think of it
            //as being a blank Request token at this point. Even though the OAuth 1.0 spec says that
            //the token is optional, just about every auth provider requires it; if it isn't there,
            //the provider would prompt the user to enter it manually, which can't be a good thing.
            //
            res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
        }
    })
});

router.get('/auth/callback', (req, res, next) => {
    if (req.session.oauth) {
        req.session.oauth.verifier = req.query.oauth_verifier;
        const oauth = req.session.oauth;

        //Here we exchange the authorized Request token for an Access token. This request is
        //signed (as all requests must be) with a key that has two parts separated by an &:
        //CONSUMER_SECRET&TOKEN_SECRET. We got TOKEN_SECRET from Twitter in the response
        //to the request for a Request token, and we own the CONSUMER_SECRET. On Twitter's
        //side they will construct the request from scratch based on both the passed params
        //and headers and re-run the signing algorithm to verify the signature (this is why
        //we aren't passing the CONSUMER_SECRET...Twitter already has it from when we set up
        //the app on their side.
        oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,

            //This function is the callback for getOAuthAccessToken. We now have
            //an Access token and secret from Twitter for this specific user, and
            //we no longer need the Request token (it's a one-time use token). The
            //results object contains the user's screen name and Twitter ID.
            function (error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
                    console.log(error);
                } else {
                    const userName = results.screen_name.split('_');
                    req.session.oauth.access_token = oauth_access_token;
                    req.session.oauth.access_token_secret = oauth_access_token_secret;
                    //console.log(results);

                    req.app.set('user', {
                        firstName: userName[0],
                        lastName: userName[1],
                        signed_in_with_twitter: true
                    });
                    res.redirect('/home');
                }
            }
        );
    } else
        next(new Error("Error: OAuth object was not present on this session."));
});

module.exports = router;
