const util = require('util');



const VALUES_ACCOUNT = `
 INSERT INTO accounts VALUES(100, 9999);
 INSERT INTO accounts VALUES(101, 3500);
 INSERT INTO accounts VALUES(102, 4550);
 INSERT INTO accounts VALUES(103, 1900);
 INSERT INTO accounts VALUES(104, 2500);
 INSERT INTO accounts VALUES(105, 5000);
`
const VALUES_CHANGE = `
 INSERT INTO account_changes VALUES(1, 102, 30, '2020-05-15', 'Lending');
 INSERT INTO account_changes VALUES(2, 105, 100, '2020-05-16', 'Bicycle buy');
 INSERT INTO account_changes VALUES(3, 101, 90, '2020-05-13', 'Monthly subscription');
 INSERT INTO account_changes VALUES(4, 103, 150, '2020-05-11', 'Groceries');
 INSERT INTO account_changes VALUES(5, 104, 200, '2020-05-19', 'Donation');
 INSERT INTO account_changes VALUES(6, 100, 160, '2020-05-21', 'School term');
`

//Take connection from main module
async function seed(connection) {
    //Promisify our query method.
    const execQuery = util.promisify(connection.query.bind(connection))
    try {
        await execQuery(VALUES_ACCOUNT);
        await execQuery(VALUES_CHANGE);
    } catch (error) {
        throw error;
    }
}

module.exports = seed;