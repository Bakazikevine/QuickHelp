const configs = {
    port: process.env.PORT || 6000,
    mongoURI: process.env.MONGODB_URI ||'mongodb://localhost:27017/Giggle',
    secret: process.env.SECRET ||'mysecret',
    JWT_SECRET_KEY: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    JWT_REFRESH_COOKIE_NAME: process.env.JWT_REFRESH_COOKIE_NAME,
}


module.exports= configs;