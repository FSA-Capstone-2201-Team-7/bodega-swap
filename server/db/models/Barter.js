const Sequelize = require('sequelize');
const db = require('../db');


const Barter = db.define('barter', {
  status: {
    type: Sequelize.ENUM('New', 'Complete', 'Pending')
  },
});

module.exports = Barter