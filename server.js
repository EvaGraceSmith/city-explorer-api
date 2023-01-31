'use strict';
// npm start for proof of life
console.log('Hello from our SERVER PORT!!!!!', process.env.PORT);


const express = require('express');
require('dotenv').config();
let data = require('./data/weather.json');
const cors = require('cors');


const app = express();
app.use(cors());
const PORT = process.env.PORT;


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


app.get('/weather', (request, response)=>{
  //http://localhost3003/weather?cityname=Seattle&&citylon="-122.33207"&&citylat="47.60621"
  try{
    let cityName = request.query.cityname;
    let cityLat = request.query.citylat;
    let cityLon = request.query.citylon;


    // let dataToSend = data.find(city => city.cityname === cityName);
    console.log('did we find city name?', cityName, cityLat,cityLon);
    let dataToInstantiate = data.find(city => city.city_name === cityName); //&&
       // city.citylat === cityLat && city.citylon === cityLon );
    if (dataToInstantiate === undefined){
      response.status(500).send('City not found');
    }
    else{
      let dataToSend = new Forecast(dataToInstantiate);
      console.log(dataToSend, 'got back from weather class');
      let returnObject= [];
      returnObject.push({'date':dataToSend.datetime});
      returnObject.push({'description':`Low of ${dataToSend.lowTemp}, high of ${dataToSend.maxTemp} with ${dataToSend.description}`});
      console.log(returnObject, 'got back to send to weather client');
      //   [
      //     {
      //       "description": "Low of 17.1, high of 23.6 with broken clouds",
      //       "date": "2021-03-31"
      //     },
      //     {
      //       "description": "Low of 17.5, high of 29.9 with few clouds",
      //       "date": "2021-04-01"
      //     },
      //     ...
      //   ]
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
    this.cityName = weatherObject.city_name;
    this.datetime = weatherObject.data[0].datetime;
    this.description = weatherObject.data[0].weather.description;
    this.lowTemp = weatherObject.data[0].low_temp;
    this.maxTemp = weatherObject.data[0].max_temp;
  }
}



// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) =>{
  response.status(500).send(error.message);
});






// this is listening for our port to start and keeps our server running
app.listen(PORT, ()=> console.log(`Listening on PORT ${PORT}`));
