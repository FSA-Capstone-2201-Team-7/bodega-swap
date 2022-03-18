const { db, Item } = require('../server/db');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const items = await Promise.all([
    Item.create({
      name: 'bicycle',
      description: 'check out my cool bike',
    }),
    Item.create({
      name: 'camera',
      description: 'here is my neat camera',
    }),
  ]);
  await db.close();
  return items;
}

seed();
