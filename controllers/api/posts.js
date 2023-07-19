

const cloudinary = require('../../config/cloudinary');
const User = require('../../models/user'); // assuming you have a User model
const Post = require('../../models/post');
const History = require('../../models/history');
const Setting = require('../../models/setting');


module.exports = {
  create,
  index,
  index_own,
  like,
  dislike,
  index_likes,
  delete: delete_post
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

    const user = await User.findById(req.user._id); //     
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
    const limit = 10;  // Define how many beats to return per page
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
    
    if(post.user.toString() !== user._id.toString()){  // only add notification if the user is not liking their own post
      const likedUser = await History.findOne({user : post.user}) // this is the user who's post it was that was liked
      const notification = {type: 'like', from: user._id, post: post._id, read: false}
      likedUser.notifications.push(notification) // this handles the notification for the like recieving user
      likedUser.save()
    }
    
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


async function delete_post(req, res){
  console.log(req.params.id)
  
  try {
    const post = await Post.findById(req.params.id)
    if (post.user.toString() !== req.user._id.toString()) throw new Error('not owner of post')

    // Find all users that liked the post
    const users = await History.find({ liked: post._id });

    // For each user, remove the reference to the post in their liked posts
    for(let user of users) {
        const index = user.liked.map(id => id.toString()).indexOf(post._id.toString());
        if(index > -1) {
            user.liked.splice(index, 1);
        }
    }

    // Find all users with notifications related to the post
    const usersWithNotifications = await History.find({ 'notifications.post': post._id });

    // For each user, remove the notification related to the post
    for(let user of usersWithNotifications) {
      user.notifications = user.notifications.filter(notification => {
        if (notification.post) {
          return notification.post.toString() !== post._id.toString();
        } else {
          return true; // retain the notification if no post is associated
        }
      });
}
    // Use a Set to get unique users
    let uniqueUsers = [...new Set([...users, ...usersWithNotifications])];

    // Save changes for all unique users
    for(let user of uniqueUsers) {
        await user.save();
    }
    

    // Delete the post
    await Post.deleteOne({_id: post._id});

    res.json({message: 'post deleted successfully'})
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  } 
}