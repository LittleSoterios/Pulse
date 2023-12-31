const { faker } = require('@faker-js/faker');
const fs = require('fs')
require('dotenv').config();
require('./config/database');


const User = require('./models/user')
const Post = require('./models/post')
const History = require('./models/history')
const Setting = require('./models/setting')

function createRandomUser(){
  const displayName = `${faker.person.firstName()} ${faker.person.lastName()}`
  const username = faker.internet.userName()

  return {
    user: {
      displayName: displayName,
      username: username,
      email: faker.internet.email(),
      password: faker.internet.password()
    },

    settings :{
      displayName: displayName,
      username: username,
      avatar: faker.image.avatar(),
      bio: faker.person.bio()
    }


    // bio: faker.person.bio()
  };
}

async function createRandomPost() {
  const x = (Math.random() < 0.3);
  const randomUser = await getRandomUser();

  const numLikes = Math.floor(Math.random() * 31);
  const arr_likes = [];

  for(let i = 0; i < numLikes; i++){
    arr_likes.push(getRandomUser());
  }

  const resolvedLikes = await Promise.all(arr_likes);

  return {
    user: randomUser._id,
    media: x ? faker.image.url() : null,
    text: x ? faker.lorem.sentences({min: 2, max: 3}) : faker.lorem.sentence(),
    likes: resolvedLikes.map(user => user._id),
  };
}


async function getRandomUser() {
  const count = await User.countDocuments(); // Get the total count of users
  const randomIndex = Math.floor(Math.random() * count); // Generate a random index
  
  const randomUser = await User.findOne().skip(randomIndex); // Skip to the random index
  
  return randomUser;
}

async function seed(){
  const arr = []

  for(let i=0; i<20; i++){
    const user = createRandomUser()
    const createdUser = await User.create(user.user)
    const settings = user.settings
    settings.user = createdUser._id
    await Setting.create(settings)
    await History.create({user: createdUser._id})
    
    arr.push(user)
  }

  const jsonArr = JSON.stringify(arr)
  fs.writeFile('users.txt', jsonArr, function(err){
    if(err) console.log(err)
  })

  for(let i=0; i<100; i++){
    const post = await createRandomPost()
    await Post.create(post)
  }

  console.log('done')
}

seed()














