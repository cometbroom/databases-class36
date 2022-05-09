const util = require("util");
const mysql = require("mysql");
const fs = require("fs/promises");
const keyQueries = require("./keys");
const relationshipQueries = require("./relationships");
const joinQueries = require("./joins");
const aggregateQueries = require("./aggregate");

//Queries needed for initiating DB
const DB = "w2_keys";
const DROP_DB = `DROP DATABASE IF EXISTS ${DB};`;
const CREATE_DB = `CREATE DATABASE ${DB};`;

const connection = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  multipleStatements: true,
});

const execQuery = util.promisify(connection.query.bind(connection));

//Function to execute an array of queries with try catch block
//And print with true.
async function runMultipleQueries(queries, hasResult = false) {
  for (let i = 0; i < queries.length; ++i) {
    try {
      const result = await execQuery(queries[i]);

      //Print result for queries that expect it
      if (hasResult === true) console.log(result);
    } catch (error) {
      console.log(`Query: ${queries[i]} has failed`);
      throw error;
    }
  }
}

//Initialize our database and its name
async function initDb() {
  connection.connect();
  try {
    await execQuery(DROP_DB + CREATE_DB);
    connection.changeUser({ database: DB });

    //Queries to make key and relationship tables
    await runMultipleQueries(keyQueries());
    await runMultipleQueries(relationshipQueries());

    //Populate tables with random data
    await populateTables();

    //Queries to return result from our tables
    await runMultipleQueries(joinQueries(), true);
    await runMultipleQueries(aggregateQueries(), true);
  } catch (error) {
    throw error;
  }
  connection.end();
}

async function populateTables() {
  //Read data file and execute to insert many values.
  const data = await fs.readFile("./data.sql", "utf-8");
  await execQuery(data);
  return data;
}

//Star tour application
initDb();
