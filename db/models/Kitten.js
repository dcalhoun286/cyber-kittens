const { database } = require('../db');
const { DataTypes } = require('sequelize');

const Kitten = database.define('kittens', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
});

module.exports = { Kitten };
