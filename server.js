'use strict';
// npm start for proof of life
console.log('Hello from our SERVER PORT!!!!!', process.env.PORT);


require('dotenv').config();
const express = require('express');
// let data = require('./data/weather.json');
const cors = require('cors');
const axios =require('axios').default;
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const weatherKey = process.env.WEATHER_API_KEY;



app.get('/', (request, response)=>{
  response .send('Hello from our server HOME route/ !!');
});




app.get('/hello',(request, response)=>{
//   response.send ('Hello from our server HOME route / !!');
  console.log('request object', request.query);
  let firstName = request.query.name;
  let lastName= request.query.lastname;
  console.log('What is your name?', firstName, lastName);
  response.status(200).send(`Hello, ${firstName} ${lastName}`);
});

//access the weather and get the query parameters
app.get('/weather', async(request, response)=>{
  //http://localhost3003/weather?cityname=Seattle&&citylon="-122.33207"&&citylat="47.60621"
  try{
    let cityName = request.query.cityname.toLowerCase();
    let cityLat = request.query.citylat;
    let cityLon = request.query.citylon;


    // let dataToSend = data.find(city => city.cityname === cityName);
    console.log('did we find city name?', cityName, cityLat,cityLon);
    // let dataToInstantiate = data.find(city => city.city_name.toLowerCase() === cityName.toLowerCase()); //&& city.lat === cityLat && city.lon === cityLon );
 
    let needApiWeather = await axios.get (`https://api.weatherbit.io/v2.0/forecast/daily`,
      {params:{
        // city:cityName,
        key: weatherKey,
        lat: cityLat,
        lon: cityLon,
      }});

    console.log('need weather', needApiWeather);

    if (needApiWeather === undefined){
      response.status(500).send('City not found');
    }
    else{
      let dataToSend = new Forecast(needApiWeather);
      console.log(dataToSend, 'got back from weather class');
      let returnObject= [];

      for (let i=0; i<dataToSend.datetime.length; i++){
        returnObject.push({'date':dataToSend.datetime[i],'description':`Low of ${dataToSend.lowTemp[i]}, high of ${dataToSend.maxTemp[i]} with ${dataToSend.description[i]}`});
        console.log(returnObject, 'got back to send to weather client');
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
    console.log('did we get an object to construct?',weatherObject.data[0].weather);
    this.datetime=[];
    this.description=[];
    this.lowTemp=[];
    this.maxTemp=[];
    for (let i=0; i<weatherObject.data.length; i++){

      this.cityName = weatherObject.city_name;
      this.datetime[i]= weatherObject.data[i].datetime;
      this.description [i]= weatherObject.data[i].weather.description;
      this.lowTemp[i] = weatherObject.data[i].low_temp;
      this.maxTemp[i] = weatherObject.data[i].max_temp;
    }

  }
}



// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) =>{
  response.status(500).send(error.message);
});






// this is listening for our port to start and keeps our server running
app.listen(PORT, ()=> console.log(`Listening on PORT ${PORT}`));
