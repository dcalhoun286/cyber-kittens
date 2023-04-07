const bcrypt = require('bcrypt');
require('dotenv').config();
const { database } = require('./db');
const { Kitten, User } = require('./models');
const { kittens, users } = require('./seedData');

const seed = async () => {

  try {

    await database.sync({ force: true }); // recreate db
  
    const userArr = await User.bulkCreate(users);
  
    userArr.forEach(async (user) => {
      const kittenArr = [...kittens];
  
      const kittenValues = await Promise.all([
        Kitten.create({...kittenArr[0], ownerId: user.id}),
        Kitten.create({...kittenArr[1], ownerId: user.id}),
      ]);
    
      kittenValues.forEach( async (val) => {
        await user.addKitten(val);
        kittenArr.shift();
      })
    })
  } catch (err) {
    console.error(err);
  }
};

module.exports = seed;
