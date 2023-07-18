

const cloudinary = require('../../config/cloudinary');
const User = require('../../models/user'); // assuming you have a User model
const Post = require('../../models/post');
const History = require('../../models/history');
const Setting = require('../../models/setting');
const { LegendToggleRounded } = require('@mui/icons-material');


module.exports = {
  create,
  index,
  index_own,
  like,
  dislike,
  index_likes
}

async function create(req, res) {
  

  try {
    let imageUrl = null
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url
    } else {
      imageUrl = null
    }

    const user = await User.findById(req.user._id); // assuming you have some authentication set up
    
    if (!user) throw new Error();

    // Save the image URL to the user's document
    // user.avatar = result.secure_url;
    
    await Post.create({ user: user, media: imageUrl, text: req.body.content, likes: [] })

    // await user.save();

    res.json(imageUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
  
};


async function index(req, res) {

  try {
    const page = parseInt(req.query.page) || 1;  // Get the page number from the query parameters
    const limit = 10;  // Define how many beats you want to return per page
    const skip = (page - 1) * limit;  // Calculate how many documents to skip
    let hasMore = true
    const history = await History.findOne({ user: req.user._id })
    

    const beats = await Post.find({
      user: { $in: history.following }
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })

    
    
    if(beats.length === 0) hasMore = false
    const pack = await Promise.all(beats.map(async (beat) => {
      const user = await Setting.findOne({user: beat.user});
      
      return {post: beat, user: user};
    }));
    res.json({pack, hasMore})
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}


async function index_own(req, res) {

  try {
    const user = await Setting.findOne({user: req.user._id});
    const beats = await Post.find({ user: req.user._id }).sort({ createdAt: -1 })

    const pack = await Promise.all(beats.map(async (beat) => {
      return { post: beat, user: user };
    }));
    res.json(pack)

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}


async function index_likes(req, res){
  try {
    
    const history = await History.findOne({user: req.user._id})
    
    const beatsUnsorted = await Post.find({
      _id: { $in: history.liked}
    })

    // Manually sorts the posts in the order they appear in history.liked
    let beats = history.liked.map(id => {
      return beatsUnsorted.find(beat => beat._id.toString() === id.toString());
    });

    beats = beats.reverse()
    
    const pack = await Promise.all(beats.map(async (beat) => {
      const user = await Setting.findOne({user: beat.user});
      return {post: beat, user: user};
    }));
    res.json(pack)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}


async function like(req, res) {

  try {
    const history = await History.findOne({ user: req.user._id })
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user._id) // this is the user that liked the post
    
    const likedUser = await History.findOne({user : post.user}) // this is the user who's post it was that was liked
    console.log('liked user: ', likedUser)
    const notification = {type: 'like', from: user._id, post: post._id, read: false}
    likedUser.notifications.push(notification) // this handles the notification for the like recieving user
    likedUser.save()
    history.liked.push(post._id) // add posted to users history
    history.save()

    post.likes.push(user._id) // add the user to the post's liked
    post.save()

    res.json({ likes: post.likes })

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
async function dislike(req, res) {

  try {
    const history = await History.findOne({ user: req.user._id })
    const post = await Post.findById(req.params.id)
    const user = await User.findById(req.user._id)

    const liked_idx = history.liked.indexOf(post._id)
    history.liked.splice(liked_idx, 1) // remove the post from the users history
    history.save()

    const idx = post.likes.indexOf(user._id)
    post.likes.splice(idx, 1) // remove the user from the post's liked
    post.save()

    res.json({ likes: post.likes })

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
