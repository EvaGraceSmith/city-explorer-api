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
  //http://localhost3003/city?cityname=Paris
  try{
    let cityName = request.query.cityname;
    let cityLat = request.query.citylat;
    let cityLon = request.query.citylon;

    // let dataToSend = data.find(city => city.cityname === cityName);
    // console.log('did we find city name?', dataToSend);
    let dataToInstantiate = data.find(city => city.cityname === cityName &&
        city.citylat === cityLat && city.citylon === cityLon );
    let dataToSend = new Weather(dataToInstantiate);
    console.log(dataToSend, 'got back from weather class');
    response.status(200).send(dataToSend);

  } catch (error){
    //create a new instance of error
    // this will instantiate any new error
    next(error);
  }
});

//The order for these messages is important
app.get('*', (request, response)=>{
  response.status(404).send('The route was not found. Error 404');
});

//class
class Weather{
  constructor(weatherObject){
    console.log('did we get an object to construct?');
    this.cityName = weatherObject.pizzatype;
    this.location = weatherObject.location;
  }
}



// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) =>{
  response.statues(500).send(error.message);
});






// this is listening for our port to start and keeps our server running
app.listen(PORT, ()=> console.log(`Listening on PORT ${PORT}`));
