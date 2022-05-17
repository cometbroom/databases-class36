const mysql      = require('mysql');
const util = require('util');
const seeder = require('./transactions-insert-values');
const transferAmount = require('./transaction');
const {NAMES} = require('./constants');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'hyfuser',
  password : 'hyfpassword',
  multipleStatements: true
});

//SQL statement Constants
//Drop database and create new
const DROP_DB = `DROP DATABASE IF EXISTS ${NAMES.DB}`;
const CREATE_DB = `CREATE DATABASE ${NAMES.DB}`;

//Create the relevant tables
const ACCOUNT_TABLE = `CREATE TABLE ${NAMES.ACCOUNTS} (
  account_number INT PRIMARY KEY NOT NULL,
  balance INT
  );`;
const ACCOUNT_CHANGES_TABLE = `CREATE TABLE ${NAMES.CHANGES} (
  change_number INT PRIMARY KEY AUTO_INCREMENT,
  account_number INT,
  amount INT,
  changed_date DATE,
  remark VARCHAR(255),
  FOREIGN KEY (account_number) REFERENCES ${NAMES.ACCOUNTS}(account_number)
  );`;

  const execQuery = util.promisify(connection.query.bind(connection))


async function seedDb() {
  try {
    connection.connect();
    await execQuery(DROP_DB);
    await execQuery(CREATE_DB);

    //Use the newly created database
    connection.changeUser({database: NAMES.DB});
    await execQuery(ACCOUNT_TABLE);
    await execQuery(ACCOUNT_CHANGES_TABLE);

    //Seed our tables with the insert module
    await seeder(connection);

    //use the transfer function from transaction module
    await transferAmount(connection, 1000, 101, 102, "Car buy");
  } catch (error) {
    throw error;
  } finally {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('query?', input => {
      connection.query(`select * from account_changes where remark = '${input}';`, (err, result) => {
        if (err) throw err;
        console.log(result);
      })  
      readline.close();
      connection.end();

    });
  }
}


seedDb();