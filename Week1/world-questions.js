const mysql = require("mysql");

const DB_LOGIN = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
};

const question1 = {
  query: `SELECT name FROM country WHERE population >= 8e6;`,
  columns: ["name"],
};
const question2 = {
  query: `SELECT name FROM country WHERE name LIKE '%land%';`,
  columns: ["name"],
};
const question3 = {
  query: `SELECT name FROM city WHERE population BETWEEN 5e5 AND 1e6;`,
  columns: ["name"],
};
const question4 = {
  query: `SELECT name FROM country WHERE continent='Europe';`,
  columns: ["name"],
};
const question5 = {
  query: `SELECT * FROM country ORDER BY SurfaceArea DESC;`,
  columns: 0,
};
const question6 = {
  query: `SELECT name FROM city WHERE CountryCode='NLD';`,
  columns: ["name"],
};
const question7 = {
  query: `SELECT population FROM city WHERE name='Rotterdam';`,
  columns: ["population"],
};
const question8 = {
  query: `SELECT name FROM country ORDER BY SurfaceArea DESC LIMIT 10;`,
  columns: ["name"],
};
const question9 = {
  query: `SELECT name FROM city ORDER BY population DESC LIMIT 10;`,
  columns: ["name"],
};
const question10 = {
  query: `SELECT SUM(population) AS populationWorld FROM country;`,
  columns: ["populationWorld"],
};

const connection = mysql.createConnection(DB_LOGIN);

const execQuery = (dbConnection, obj, logOrTable = "table") => {
  dbConnection.query(obj.query, (err, result) => {
    if (err) throw err;
    let innerMap;
    if (obj.columns) innerMap = (row) => obj.columns.map((col) => row[col]);
    else innerMap = (row) => [...Object.values(row)];
    const display = result.map(innerMap);
    console[logOrTable](display);
  });
};

const runQueries = () => {
  connection.connect();
  [question1, question2, question3, question4].forEach((q) =>
    execQuery(connection, q)
  );
  execQuery(connection, question5, "log");
  [question6, question7, question8, question9, question10].forEach((q) =>
    execQuery(connection, q)
  );
  connection.end();
};

runQueries();
