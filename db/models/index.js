const { User } = require('./User');
const { Kitten } = require('./Kitten');

Kitten.belongsTo(User, {foreignKey: 'ownerId'}); // Kitten table, there will be an ownerId <- FK
User.hasMany(Kitten);

module.exports = {
    User,
    Kitten
}
