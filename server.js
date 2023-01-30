'use strict';
// npm start for proof of life
console.log('Hello from our SERVER PORT!!!!!', process.env.PORT);


const express = require('express');
require('dotenv').config();


const app = express();

const PORT = process.env.PORT;


app.get('/',(request, response)=>{
response.send ('Hello from our server HOME route / !!');
});

app.get('/hello', (request, response) =>{
    
})




app.listen(PORT, ()=> console.log(`Listening on PORT ${PORT}`));
