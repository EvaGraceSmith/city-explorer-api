'use strict';


const axios = require('axios').default;
const yelpKey = process.env.YELP_API_KEY;

//class
class Yelp {
  constructor(yelpObject) {
    console.log('did we get an object to construct?', yelpObject.data.data[0].yelp);
    this.datetime = [];
    this.description = [];
    this.lowTemp = [];
    this.maxTemp = [];
    for (let i = 0; i < yelpObject.data.data.length; i++) {

      this.cityName = yelpObject.data.city_name;
      this.datetime[i] = yelpObject.data.data[i].datetime;
      this.description[i] = yelpObject.data.data[i].weather.description;
      this.lowTemp[i] = yelpObject.data.data[i].low_temp;
      this.maxTemp[i] = yelpObject.data.data[i].max_temp;
    }
  }
}

Yelp.yelpRequest = async (request, response) => {
  try {
    let cityName = request.query.cityname.toLowerCase();

    console.log('did we find city name?', cityName);

    let needApiYelp = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`,
      {
        params: {
          api_key: yelpKey,
          query: cityName,
        }
      }
    );

    // console.log('need yelp', needApiYelp);

    if (needApiYelp === undefined) {
      response.status(500).send('City not found');
    }
    else {
      let dataToSend = new Yelp(needApiYelp);
      // console.log(dataToSend, 'got back from yelp class');
      let returnObject = [];

      for (let i = 0; i < dataToSend.title.length; i++) {
        returnObject.push(
          {
            'title': `${dataToSend.title[i]}`,
            'overview': `${dataToSend.overview[i]}`
          });
        // console.log(returnObject, 'got back to send to yelp client');
      }

      response.status(200).send(returnObject);
    }

  } catch (error) {
    //create a new instance of error
    // this will instantiate any new error
    response.status(500).send(error.message);
  }
};


module.exports = Yelp;