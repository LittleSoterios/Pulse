const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const historySchema = new Schema ({
  user: {type : mongoose.Types.ObjectId, ref: 'User'},
  followers: [{type : mongoose.Types.ObjectId, ref: 'User'}],
  following: [{type : mongoose.Types.ObjectId, ref: 'User'}],
  liked: [{type : mongoose.Types.ObjectId, ref: 'Post'}],
  notifications: [{
  type: { 
    type: String, 
    enum: ['like', 'comment', 'follow'], 
    required: true 
  },
  from: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  post: { 
    type: mongoose.Types.ObjectId, 
    ref: 'Post', 
  },
  read: {type: Boolean, default: false},
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}],
})

module.exports = mongoose.model('History', historySchema)