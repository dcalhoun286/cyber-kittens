const {Sequelize, sequelize} = require('./db');

const Kitten = sequelize.define('kittens', {
  name: Sequelize.STRING,
  color: Sequelize.STRING,
  age: Sequelize.INTEGER
});

module.exports = { Kitten };
