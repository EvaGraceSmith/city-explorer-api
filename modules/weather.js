'use strict';


const axios = require('axios').default;
const weatherKey = process.env.WEATHER_API_KEY;

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

    // let dataToSend = data.find(city => city.cityname === cityName);
    console.log('did we find city lat/lon?', cityLat, cityLon);
    // let dataToInstantiate = data.find(city => city.city_name.toLowerCase() === cityName.toLowerCase()); //&& city.lat === cityLat && city.lon === cityLon );

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
      let dataToSend = new Weather(needApiWeather);
      // console.log(dataToSend, 'got back from weather class');
      let returnObject = [];

      for (let i = 0; i < dataToSend.datetime.length; i++) {
        returnObject.push({ 'date': dataToSend.datetime[i], 'description': `Low of ${dataToSend.lowTemp[i]}, high of ${dataToSend.maxTemp[i]} with ${dataToSend.description[i]}` });
        // console.log(returnObject, 'got back to send to weather client');
      }

      response.status(200).send(returnObject);
    }

  } catch (error) {
    //create a new instance of error
    // this will instantiate any new error
    response.status(500).send(error.message);
  }
};


module.exports = Weather;
