const configs = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGODB_URI ||"mongodb+srv://queencarine:KKiQlC8UBbJ1ho9C@cluster0.bocqitm.mongodb.net/",
    JWT_SECRET: process.env.SECRET ||'mysecret'
}
module.exports= configs;