const bcrypt = require('bcrypt');
require('dotenv').config();
const { database } = require('./db');
const { Kitten, User } = require('./models');
const { kittens, users } = require('./seedData');

const seed = async () => {

  try {

    await database.sync({ force: true }); // recreate db
  
    const userArr = await User.bulkCreate(users);
    const kittenArr = [...kittens];
  
    userArr.forEach(async (user) => {

      const kitten1 = kittenArr.shift();
      const kitten2 = kittenArr.shift();

      const kittenValues = await Promise.all([
        Kitten.create({...kitten1, ownerId: user.id}),
        Kitten.create({...kitten2, ownerId: user.id}),
      ]);
    
      kittenValues.forEach( async (val) => {
        await user.addKitten(val);
      })
    })
  } catch (err) {
    console.error(err);
  }
};

module.exports = seed;
