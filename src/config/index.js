const configs = {
    port: process.env.PORT || 6000,
    mongoURI: process.env.MONGODB_URI ||'mongodb://localhost:27017/Giggle',
    JWT_SECRET: process.env.SECRET ||'mysecret'
}


module.exports= configs;