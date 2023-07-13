const { faker } = require('@faker-js/faker');
const fs = require('fs')
require('dotenv').config();
require('./config/database');


const User = require('./models/user')
const Post = require('./models/post')

function createRandomUser(){
  return {
    displayName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    bio: faker.person.bio()
  };
}

function createRandomPost(){
  const x = (Math.random()< 0.3)
  return{
    user: getRandomUser().id,
    media: x ? faker.image.url(): null,
    text: x ? faker.lorem.sentences({min: 2, max: 3}) : faker.lorem.sentence() 
  }
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
    await User.create(user)
    arr.push(user)
  }

  const jsonArr = JSON.stringify(arr)
  fs.writeFile('users.txt', jsonArr, function(err){
    if(err) console.log(err)
  })

  for(let i=0; i<100; i++){
    const post = createRandomPost()
    await Post.create(post)
  }
}

seed()












