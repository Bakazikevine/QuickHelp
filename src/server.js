const dotenv = require ('dotenv');
dotenv.config()
const express = require('express');
const userRoutes=require('../src/Routes/userRoutes.js')
const app = express()
const mongoose = require ('mongoose');
const cors=require('cors');
const configuration = require('../src/config/index.js')

const employeeroute=require('./routes/employeeRoute.js');

app.use(express.json());
app.use('/employee',employeeroute)

//middlewares
app.use(express.json());
app.use(cors());
//routes
app.use('/api/v1/auth',userRoutes)

mongoose.connect(configuration.mongoURI)
.then(() => {
    app.listen(configuration.port, ()=> {
        console.log("listening on port "+configuration.port);
    });
})
.catch(err => {
    console.log(err);
});

