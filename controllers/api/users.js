const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const History = require('../../models/history')

module.exports = {
  create,
  login,
  checkToken,
  search,
  follow,
  unfollow,
  getHistory
};

async function create(req, res) {
  try {
    // Add the user to the db
    const user = await User.create(req.body);
    await History.create({user: user._id})
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
    const profiles = await User.find({
      $or: [
        {displayName: { $regex: SearchString, $options: 'i'}},
        { username: { $regex: SearchString, $options: 'i' } }
      ]})

    const profile_obj = []
    profiles.forEach(function (profile){
      if(history.following.includes(profile._id)){
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
    history.following.push(req.params.id)
    history.save()

    const history_2 = await History.findOne({user: req.params.id})
    history_2.followers.push(req.user._id)
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
    var idx = history.following.indexOf(req.params.id)
    history.following.splice(idx, 1)
    history.save()

    const history_2 = await History.findOne({user: req.params.id})
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
    res.json(history)

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');    
  }
}