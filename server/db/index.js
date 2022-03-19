const db = require('./db');
const Item = require('./models/Item');
const Barter = require('./models/Barter');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const User = require('./models/User');

User.hasMany(Item);
Item.belongsTo(User);

User.hasMany(Barter);
Barter.belongsTo(User);

Barter.hasMany(Item);
Item.belongsTo(Barter);

module.exports = {
  Conversation,
  Message,
  Barter,
  Item,
  db,
};
