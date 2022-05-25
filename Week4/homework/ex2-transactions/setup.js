//get json data to seed our db
const accountsData = require("./accounts.json");

async function seedDb(client) {
  try {
    //Connect and clear our collections
    const db = await client.db("databaseWeek4");
    const collection = await db.collection("accounts");
    await collection.deleteMany({});

    //Reseed our db
    await collection.insertMany(accountsData);
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

module.exports = { seed: seedDb };
