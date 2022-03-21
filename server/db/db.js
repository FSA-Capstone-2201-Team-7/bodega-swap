const Sequelize = require('sequelize');
const pkg = require('../../package.json');
require('dotenv').config();

const databaseName =
  pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '');

const config = {
  logging: false,
};

if (process.env.LOGGING === 'true') {
  delete config.logging;
}

//https://stackoverflow.com/questions/61254851/heroku-postgres-sequelize-no-pg-hba-conf-entry-for-host
if (process.env.DATABASE_URL) {
  config.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const db = new Sequelize(process.env.REACT_APP_DATABASE_URL, config);

// o: remove

// async function test() {
//   try {
//     await db.sync();
//     console.log('Connection has been established successfully.');
//     await db.close();
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// test();

module.exports = db;
