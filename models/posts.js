const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  media: String,
  text: {
    type: String,
    required: true,
    maxlength: 280
  },
  likes: Number

},{
  timestamps: true
})

module.exports = mongoose.model('Post', postSchema)