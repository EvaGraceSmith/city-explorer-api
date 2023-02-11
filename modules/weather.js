'use strict';


const axios = require('axios').default;
const weatherKey = process.env.WEATHER_API_KEY;
// const Cache = require('./cache.js');
let cache = {};
let acceptableTimeToCache = 1000 * 60 * 60 * 24;
console.log(acceptableTimeToCache);
let testTimeToCache = 1000 * 10;
//about ten seconds
console.log(testTimeToCache);
console.log('empty',cache);
//class
class Weather {
  constructor(weatherObject) {
    console.log('did we get an object to construct?', weatherObject.data.data[0].weather);
    this.datetime = [];
    this.description = [];
    this.lowTemp = [];
    this.maxTemp = [];
    for (let i = 0; i < weatherObject.data.data.length; i++) {

      this.cityName = weatherObject.data.city_name;
      this.datetime[i] = weatherObject.data.data[i].datetime;
      this.description[i] = weatherObject.data.data[i].weather.description;
      this.lowTemp[i] = weatherObject.data.data[i].low_temp;
      this.maxTemp[i] = weatherObject.data.data[i].max_temp;
    }
  }
}

Weather.weatherRequest = async (request, response) => {
  //http://localhost3003/weather?cityname=Seattle&&citylon="-122.33207"&&citylat="47.60621"
  try {
    let cityLat = request.query.citylat;
    let cityLon = request.query.citylon;
    let cityName = request.query.cityname.toLowerCase();
    console.log('did we find city name?', cityName);

    // let dataToSend = data.find(city => city.cityname === cityName);
    console.log('did we find city lat/lon?', cityLat, cityLon);
    // let dataToInstantiate = data.find(city => city.city_name.toLowerCase() === cityName.toLowerCase()); //&& city.lat === cityLat && city.lon === cityLon );
    console.log('Go find weather for ?', cityName);
    let returnArrayofObjects = [];

    let key = cityName + '-Data';

    if(cache[key] &&( Date.now() - cache[key].timeStamp) < acceptableTimeToCache){
      //if it is already in cache give them that data from the cache.
      console.log(cache[key], ' is in the cache already');
      returnArrayofObjects = cache[key].data;
    }

    else {
      let needApiWeather = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`,
        {
          params: {
            key: weatherKey,
            lat: cityLat,
            lon: cityLon,
          }
        }
      );

      // console.log('need weather', needApiWeather);

      if (needApiWeather === undefined) {
        response.status(500).send('City not found');
      }
      else {
        let weatherdataToSend = new Weather(needApiWeather);
        // console.log(dataToSend, 'got back from weather class');


        for (let i = 0; i < weatherdataToSend.datetime.length; i++) {
          returnArrayofObjects.push({ 'date': weatherdataToSend.datetime[i], 'description': `Low of ${weatherdataToSend.lowTemp[i]}, high of ${weatherdataToSend.maxTemp[i]} with ${weatherdataToSend.description[i]}` });
        // console.log(returnObject, 'got back to send to weather client');
        }
        console.log('add to cache ' + key);
        cache[key] = {
          data: returnArrayofObjects,
          timeStamp: Date.now()
        };
      }
      response.status(200).send(returnArrayofObjects);
    }

  } catch (error) {
    //create a new instance of error
    // this will instantiate any new error
    response.status(500).send(error.message);
  }
};


module.exports = Weather;
