const { db } = require('./db');
const port = process.env.PORT || 3000; // this can be very useful if you deploy to Heroku!
const app = require('./app');
const seed = require('../seed');

const init = async () => {
  try {
    if (process.env.SEED === 'true') {
      await seed();
    } else {
      await db.sync();
    }
    // start listening (and create a 'server' object representing our server)
    app.listen(port, () =>
      console.log(`Your server, listening on port ${port}`)
    );
  } catch (ex) {
    console.log(ex);
  }
};

init();
