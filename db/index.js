const { User, Kitten } = require('./models');
const seed = require('./seedFn');
const { database } = require('./db');

module.exports = {
    Kitten,
    User,
    database,
    seed
};
