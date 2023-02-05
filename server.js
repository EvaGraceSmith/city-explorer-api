'use strict';
// npm start for proof of life



require('dotenv').config();
const express = require('express');
// let data = require('./data/weather.json');
const cors = require('cors');
const axios =require('axios').default;
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const weatherKey = process.env.WEATHER_API_KEY;
const movieKey = process.env.MOVIE_API_KEY;
console.log('Hello from our SERVER PORT!!!!!', process.env.PORT);


app.get('/', (request, response)=>{
  response .send('Hello from our server HOME route/ !!');
});


//WEATHER
//access the weather and get the query parameters
app.get('/weather', async(request, response)=>{
  //http://localhost3003/weather?cityname=Seattle&&citylon="-122.33207"&&citylat="47.60621"
  try{
    let cityLat = request.query.citylat;
    let cityLon = request.query.citylon;

    // let dataToSend = data.find(city => city.cityname === cityName);
    console.log('did we find city lat/lon?', cityLat,cityLon);
    // let dataToInstantiate = data.find(city => city.city_name.toLowerCase() === cityName.toLowerCase()); //&& city.lat === cityLat && city.lon === cityLon );

    let needApiWeather = await axios.get (`https://api.weatherbit.io/v2.0/forecast/daily`,
      {params:{
        key: weatherKey,
        lat: cityLat,
        lon: cityLon,
      }}
    );

    // console.log('need weather', needApiWeather);

    if (needApiWeather === undefined){
      response.status(500).send('City not found');
    }
    else{
      let dataToSend = new Forecast(needApiWeather);
      // console.log(dataToSend, 'got back from weather class');
      let returnObject= [];

      for (let i=0; i<dataToSend.datetime.length; i++){
        returnObject.push({'date':dataToSend.datetime[i],'description':`Low of ${dataToSend.lowTemp[i]}, high of ${dataToSend.maxTemp[i]} with ${dataToSend.description[i]}`});
        // console.log(returnObject, 'got back to send to weather client');
      }

      response.status(200).send(returnObject);
    }

  } catch (error){
    //create a new instance of error
    // this will instantiate any new error
    response.status(500).send(error.message);
  }
});

//MOVIE
//access the movie and get the query parameters
app.get('/movie', async(request, response)=>{
  try{
    let cityName = request.query.cityname.toLowerCase();

    console.log('did we find city name?', cityName);


    let needApiMovie = await axios.get (`https://api.themoviedb.org/3/search/movie`,
      {params:{
        api_key: movieKey,
        query: cityName,
      }}
    );

    // console.log('need movie', needApiMovie);

    if (needApiMovie === undefined){
      response.status(500).send('City not found');
    }
    else{
      let dataToSend = new Movie(needApiMovie);
      // console.log(dataToSend, 'got back from movie class');
      let returnObject= [];

      for (let i=0; i<dataToSend.title.length; i++){
        returnObject.push(
          {'title': `${dataToSend.title[i]}`,
            'overview': `${dataToSend.overview[i]}`
          });
        // console.log(returnObject, 'got back to send to movie client');
      }

      response.status(200).send(returnObject);
    }

  } catch (error){
    //create a new instance of error
    // this will instantiate any new error
    response.status(500).send(error.message);
  }
});





//The order for these messages is important
app.get('*', (request, response)=>{
  response.status(404).send('The route was not found. Error 404');
});


//class
class Forecast{
  constructor(weatherObject){
    console.log('did we get an object to construct?',weatherObject.data.data[0].weather);
    this.datetime=[];
    this.description=[];
    this.lowTemp=[];
    this.maxTemp=[];
    for (let i=0; i<weatherObject.data.data.length; i++){

      this.cityName = weatherObject.data.city_name;
      this.datetime[i]= weatherObject.data.data[i].datetime;
      this.description [i]= weatherObject.data.data[i].weather.description;
      this.lowTemp[i] = weatherObject.data.data[i].low_temp;
      this.maxTemp[i] = weatherObject.data.data[i].max_temp;
    }

  }
}


//https://developers.themoviedb.org/3/configuration/get-api-configuration
//image sample:
//https://image.tmdb.org/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg
class Movie{
  constructor(movieObject){
    console.log('did we get an object to construct?',movieObject.data.results[0]);
    this.title=[];
    this.overview=[];


    for (let i=0; i<movieObject.data.results.length; i++){


      //this needs to be made specific to the movie api web pacge
      // this.cityName = movieObject.data.city_name;
      this.title[i]= movieObject.data.results[i].title;
      this.overview [i]= movieObject.data.results[i].overview;

    }

  }
}



// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) =>{
  response.status(500).send(error.message);
});






// this is listening for our port to start and keeps our server running
app.listen(PORT, ()=> console.log(`Listening on PORT ${PORT}`));
