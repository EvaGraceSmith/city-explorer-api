'use strict';

const movieKey = process.env.MOVIE_API_KEY;
const axios = require('axios').default;

class Movie {
  constructor(movieObject) {
    console.log('did we get an object to construct?', movieObject.data.results[0]);
    this.title = [];
    this.overview = [];

    for (let i = 0; i < movieObject.data.results.length; i++) {

      this.title[i] = movieObject.data.results[i].title;
      this.overview[i] = movieObject.data.results[i].overview;

    }
  }
}
Movie.movieRequest = async (request, response) => {
  try {
    let cityName = request.query.cityname.toLowerCase();

    console.log('did we find city name?', cityName);


    let needApiMovie = await axios.get(`https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: movieKey,
          query: cityName,
        }
      }
    );

    // console.log('need movie', needApiMovie);

    if (needApiMovie === undefined) {
      response.status(500).send('City not found');
    }
    else {
      let dataToSend = new Movie(needApiMovie);
      // console.log(dataToSend, 'got back from movie class');
      let returnObject = [];

      for (let i = 0; i < dataToSend.title.length; i++) {
        returnObject.push(
          {
            'title': `${dataToSend.title[i]}`,
            'overview': `${dataToSend.overview[i]}`
          });
        // console.log(returnObject, 'got back to send to movie client');
      }

      response.status(200).send(returnObject);
    }
    //create a new instance of error
    // this will instantiate any new error
  } catch (error) {
    console.error(error);
    response.status(500).send(error.message);
    // throw new Error(error);
  }



};

//https://developers.themoviedb.org/3/configuration/get-api-configuration
//image sample:
//https://image.tmdb.org/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg



module.exports = Movie;
