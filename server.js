'use strict';
// npm start for proof of life

require('dotenv').config();
const express = require('express');
// let data = require('./data/weather.json');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5005;
const Weather = require('./modules/weather');
const Movie = require('./modules/movie');
const Yelp = require('./modules/yelp');
console.log('Hello from our SERVER PORT!!!!!', process.env.PORT);


app.get('/', (request, response)=>{response.send('Hello from our server HOME route/ !!');});

//WEATHER
app.get('/weather', Weather.weatherRequest);

//MOVIE
app.get('/movie', Movie.movieRequest);

//YELP
app.get('/yelp', Yelp.yelpRequest);

//The order for these messages is important
app.get('*', (request, response)=>{response.status(404).send('The route was not found. Error 404');});

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) =>{ response.status(500).send(error.message);});

// this is listening for our port to start and keeps our server running
app.listen(PORT, ()=> console.log(`Listening on PORT ${PORT}`));
