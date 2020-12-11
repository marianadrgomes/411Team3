const express = require('express');
const router = express.Router();
const db = require('../mongoConnection');
let results;

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

module.exports = router;
