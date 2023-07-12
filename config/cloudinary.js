const cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: 'dhwzby5cr', 
  api_key: process.env.ClOUDINARY_API_KEY, 
  api_secret: process.env.ClOUDINARY_API_SECRET 
});

module.exports = cloudinary