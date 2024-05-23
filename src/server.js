const dotenv = require ('dotenv');
dotenv.config()
const express = require('express');
const userRoutes=require('../src/Routes/userRoutes.js')
const swaggerUi=require('swagger-ui-express')
const app = express()
const mongoose = require ('mongoose');
const cors=require('cors');
const path = require('path');
const configuration = require('../src/config/index.js')
const swagger = require('../src/docs/swagger.json');
const employeeroute=require('./Routes/employeeRoute.js');
const jobRoutes=require('../src/Routes/jobRoutes.js')
const bookingRoutes=require('../src/Routes/bookingRoutes.js')
//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use('/api/v1/employee',employeeroute)
app.use('/QuickHelp', swaggerUi.serve, swaggerUi.setup(swagger));
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/Jobs',jobRoutes);
app.use('/api/v1/Booking',bookingRoutes)
app.use('/upload', express.static(path.join(__dirname, 'upload')));

mongoose
  .connect(configuration.mongoURI)
  .then(() => {
    app.listen(configuration.port, () => {
      console.log("listening on port " + configuration.port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
  