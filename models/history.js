const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const historySchema = new Schema ({
  user: {type : mongoose.Types.ObjectId, ref: 'User'},
  followers: [{type : mongoose.Types.ObjectId, ref: 'User'}],
  following: [{type : mongoose.Types.ObjectId, ref: 'User'}],
  liked: [{type : mongoose.Types.ObjectId, ref: 'Post'}],
})

module.exports = mongoose.model('History', historySchema)