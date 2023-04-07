const { database } = require('../db');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SALT_COUNT = Number(process.env.SALT_COUNT);

const User = database.define('users',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    hooks: {
      beforeCreate: (user) => {
        if (user.password) {
          user.dataValues.password = bcrypt.hashSync(user.password, SALT_COUNT);
        }
      },
      beforeBulkCreate: (users) => {
        users.forEach((user) => {
          user.dataValues.password = bcrypt.hashSync(user.password, SALT_COUNT);
        })
      }
    }
  }
);

module.exports = { User };
