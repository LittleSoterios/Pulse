const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

const userSchema = new Schema({
  displayName: {type: String, required: true},
  username: {
    type: String, 
    required: true, 
    unique: true, 
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar : {
    type: String,
    default: 'https://res.cloudinary.com/dhwzby5cr/image/upload/v1689154217/default-avatar.jpg'
  },
  bio: {type: String}

}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

userSchema.index({ displayName: 'text', username: 'text' }); // this allows me to do searching by using $text


userSchema.pre('save', async function(next) {
  // 'this' is the user document
  if (!this.isModified('password')) return next();
  // Replace the password with the computed hash
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

module.exports = mongoose.model('User', userSchema);