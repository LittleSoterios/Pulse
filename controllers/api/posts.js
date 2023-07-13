const cloudinary = require('../../config/cloudinary');
const User = require('../../models/user'); // assuming you have a User model
const Post = require('../../models/post')

module.exports = {
  create,
  index
}

async function create (req, res) {
  console.log(req.user)
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const user = await User.findOne({email: req.body.userEmail}); // assuming you have some authentication set up
    console.log(user)
    if (!user) throw new Error();

    // Save the image URL to the user's document
    // user.avatar = result.secure_url;

    await Post.create({user: user, media: result.secure_url, text: req.body.content, likes: 0})

    // await user.save();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


async function index (req, res){
  try {
    const beats = await Post.find().sort({timestamp: -1})
    res.json(beats)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}