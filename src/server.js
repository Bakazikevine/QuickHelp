const dotenv = require ('dotenv');
dotenv.config()
const express = require('express');
const userRoutes=require('../src/Routes/userRoutes.js')
const swaggerUi=require('swagger-ui-express')
const app = express()
const mongoose = require ('mongoose');
const cors=require('cors');
const configuration = require('../src/config/index.js')
const swagger = require('../src/docs/swagger.json');
//middlewares
app.use(express.json());
app.use(cors());

//routes
const employeeroute=require('./Routes/employeeRoute.js');
app.use('/api/v1/employee',employeeroute)
app.use('/QuickHelp', swaggerUi.serve, swaggerUi.setup(swagger));
app.use('/api/v1/auth',userRoutes)

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
  