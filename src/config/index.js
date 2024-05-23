const dotenv =  require ("dotenv");
const twilio = require('twilio');
dotenv.config()
const configs = {
    port: process.env.PORT ,
    mongoURI: process.env.MONGODB_URI ,
    JWT_SECRET: process.env.SECRET ,
     
}

module.exports= configs;