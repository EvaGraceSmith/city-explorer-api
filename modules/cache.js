'use strict';

class Cache{

  constructor (){
    this.cache = {};
    this.acceptableTimeToCache = 1000 * 60 * 60 * 24 * 30;
    console.log(this.acceptableTimeToCache);
    this.testTimeToCache = 1000 * 10;
    //about ten seconds
    console.log(this.testTimeToCache);
    console.log('empty',this.cache);
  }

  check (searchQueryFromTheFrontEnd){
    console.log(searchQueryFromTheFrontEnd, ' checking if in cache');
    let key = searchQueryFromTheFrontEnd + '-Data';
    console.log(this.acceptableTimeToCache);
    if(this.cache[key] && Date.now() - this.cache[key].timeStamp < this.acceptableTimeToCache){
    //if it is already in cache give them that data from the cache.
      console.log(this.cache[key], ' is in the cache already');
      return true;
    }
    else
    {
      console.log(searchQueryFromTheFrontEnd, ' is not in the cache');
      return false;
    }
  }

  get(searchQueryFromTheFrontEnd){
    let key = searchQueryFromTheFrontEnd + '-Data';
    //update time
    this.cache[key].timeStamp= Date.now();
    return(this.cache[key].data);
  }

  add(searchQueryFromTheFrontEnd, weatherdataToSend){
    let key = searchQueryFromTheFrontEnd + '-Data';
    this.cache[key] = {
      data: weatherdataToSend,
      timeStamp: Date.now()
    };

  }
}

module.exports = Cache;













