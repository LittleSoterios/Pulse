

const cloudinary = require('../../config/cloudinary');
const User = require('../../models/user'); // assuming you have a User model
const Post = require('../../models/post');
const post = require('../../models/post');


module.exports = {
  create,
  index,
  index_own,
  like,
  dislike
}

async function create (req, res) {
  console.log('file', !!req.file)
  try {
    let imageUrl = null
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url
    } else {
      imageUrl = null
    }

    const user = await User.findOne({email: req.body.userEmail}); // assuming you have some authentication set up
    console.log(user)
    if (!user) throw new Error();

    // Save the image URL to the user's document
    // user.avatar = result.secure_url;

    await Post.create({user: user, media: imageUrl, text: req.body.content, likes: 0})

    // await user.save();

    res.json(imageUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


async function index (req, res){
  try {
    const beats = await Post.find().sort({createdAt: -1})
    const pack = await Promise.all(beats.map(async (beat) => {
      const user = await User.findById(beat.user);
      return { post: beat, user: user };
  }));
    res.json(pack)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
async function index_own (req, res){
  console.log(req.query.userId)
  try {
    const beats = await Post.find({user: req.query.userId}).sort({createdAt: -1})
    const pack = await Promise.all(beats.map(async (beat) => {
      const user = await User.findById(beat.user);
      return { post: beat, user: user };
  }));
    res.json(pack)


  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

async function like(req, res){
  console.log(req.params.id, req.query.userId)
  try {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.query.userId)
    post.likes.push(user._id)
    post.save()
    res.json({likes: post.likes})
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
async function dislike(req, res){
  console.log(req.params.id, req.query.userId)
  try {
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.query.userId)
    const idx = post.likes.indexOf(user._id)
    post.likes.splice(idx, 1)
    post.save()
    res.json({likes: post.likes})
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
  