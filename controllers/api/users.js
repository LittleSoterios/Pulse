const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const History = require('../../models/history')
const Setting = require('../../models/setting')
const Post = require('../../models/post')
const cloudinary = require('../../config/cloudinary')
const sharp = require('sharp')
const fs = require('fs')

module.exports = {
  create,
  login,
  checkToken,
  search,
  follow,
  unfollow,
  getHistory,
  changeAvatar,
  getNotifications
};

async function create(req, res) {
  
  try {
    // Add the user to the db
    const user = await User.create(req.body);
    await History.create({user: user._id})
    await Setting.create({user: user._id, displayName: req.body.displayName, username: req.body.username})
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function login(req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    const token = createJWT(user);
    res.json(token);
  } catch (err) {
    res.status(400).json('Bad Credentials');
  } finally{
    const user = await User.findOne({email: req.body.email})
    console.log('USER', user)
    console.log('password matches:', await bcrypt.compare(req.body.password, user.password))
  }
}


function checkToken(req, res) {
  // req.user wll always be there for you when a token is sent 
  res.json(req.exp)
}


/*--- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}


async function search(req, res,next){
  const SearchString = req.query.search
  User.ensureIndexes()
  
  try {
    const history = await History.findOne({user: req.user._id})
    const profiles = await Setting.find({
      $or: [
        {displayName: { $regex: SearchString, $options: 'i'}},
        { username: { $regex: SearchString, $options: 'i' } }
      ]})

    const profile_obj = []
    profiles.forEach(function (profile){
      if(history.following.includes(profile.user)){
        profile_obj.push({profile: profile, following: true})
      } else{
        profile_obj.push({profile: profile, following: false})
      }
    })
    
    res.json(profile_obj)


  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }

}


async function follow(req, res){

  try {
    const history = await History.findOne({user: req.user._id})
    const settings = await Setting.findById(req.params.id)
    
    
    
    history.following.push(settings.user)
    history.save()
    
    const history_2 = await History.findOne({user: settings.user})
    history_2.followers.push(req.user._id)
    
    const notification = {type: 'follow', from: req.user._id}
    history_2.notifications.push(notification)
    history_2.save()

    res.json(history)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
async function unfollow(req, res){

  try {
    const history = await History.findOne({user: req.user._id})
    const settings = await Setting.findById(req.params.id)

    var idx = history.following.indexOf(settings.user)
    history.following.splice(idx, 1)
    history.save()

    const history_2 = await History.findOne({user: settings.user})
    idx = history_2.following.indexOf(req.user._id)
    history_2.following.splice(idx, 1)
    history_2.save()

    res.json(history)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

async function getHistory(req, res){

  try {
    const history = await History.findOne({user: req.user._id})
    const settings = await Setting.findOne({user: req.user._id})
    res.json({history, settings})

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');    
  }
}

async function changeAvatar(req, res){
   // req.file doesn't exist
  try {
    const file = req.file.path;  // multer adds the path to the request

    const image = sharp(file);
    const metadata = await image.metadata();

    const size = Math.min(metadata.width, metadata.height);

    // Resize the image to be a square with the size of the smaller dimension
    await image
      .resize(size, size, {
        fit: 'cover',
      })
      .toFile(`uploads/${req.user._id}_avatar`); // change this to where you want to save the cropped image

    // delete the original file
    fs.unlinkSync(file);
    
    const result = await cloudinary.uploader.upload(`uploads/${req.user._id}_avatar`);

    fs.unlink(`uploads/${req.user._id}_avatar`, (err) => {
      if (err) {
        console.error(err)
        
      }})
    
    const imageUrl = result.secure_url
    console.log(imageUrl)
    
    const user = await Setting.findOne({user: req.user._id})
    console.log(user.avatar)

    if(!user.avatar.includes('default-avatar')){
      
      const old_url = user.avatar
      const old_id = old_url.split('/').pop().split('.')[0];
  
      await cloudinary.uploader.destroy(old_id, function(error, result){
        console.log(error, result)
      })
    }

    user.avatar = imageUrl
    await user.save()
    
    res.json(user);
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
    
  }
}


async function getNotifications(req, res){
  
  try {

    const history = await History.findOne({user: req.user._id})
    const notifications = history.notifications
    notifications.sort((a,b)=> b.createdAt - a.createdAt)

    const pack = await Promise.all(notifications.map(async (notification) =>{
      console.log(notification.from, 'this is notification from!!!JDKBSVDBJKVJ')
      const user = await Setting.findOne({user: notification.from})
      console.log('user!!!: ', user)
      const post = await Post.findById(notification.post)
      const type = notification.type
      console.log(`${user.displayName} ${type}'d you`)
      return {from: user, post, type}
    }))

    res.json(pack)


    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
    
  }
}