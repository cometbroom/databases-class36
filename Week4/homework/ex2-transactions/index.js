const { MongoClient } = require("mongodb");
const db = require("./setup");
const { transfer } = require("./transfer");
require("dotenv").config();
const client = new MongoClient(process.env.MONGODB_URL);

async function main() {
  try {
    await client.connect();
    await db.seed(client);

    await transfer(100, 102, 850, "rent");
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

main();
