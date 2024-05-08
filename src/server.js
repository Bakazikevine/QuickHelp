const dotenv = require ('dotenv');
dotenv.config()
const express = require('express');
const app = express()
const mongoose = require ('mongoose');
const configuration = require('../src/config/index.js')

app.use(express.json());

mongoose.connect(configuration.mongoURI)
.then(() => {
    app.listen(configuration.port, ()=> {
        console.log("listening on port "+configuration.port);
    });
})
.catch(err => {
    console.log(err);
});

