const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const settingSchema = new Schema ({
  user: {type : mongoose.Types.ObjectId, ref: 'User'},
  displayName: {type: String, required: true},
  username: {
    type: String, 
    required: true, 
    unique: true, 
    trim: true
  },
  avatar : {
    type: String,
    default: 'https://res.cloudinary.com/dhwzby5cr/image/upload/v1689154217/default-avatar.jpg'
  },
  bio: {type: String}
})

module.exports = mongoose.model('Setting', settingSchema)