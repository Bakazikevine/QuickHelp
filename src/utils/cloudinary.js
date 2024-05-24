const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dufg15kbx',
  api_key: process.env.CLOUD_KEY || '899554284328469',
  api_secret: process.env.CLOUD_SECRET || 'AMt6FmRwCaiJp9KYAtKchqi4dKQ'
});
module.exports = cloudinary;