const util = require('util');
const {NAMES} = require('./constants');

//Method to add or remove amount
const adjustAmount = (amount, accountNum) => {
    return `
      UPDATE ${NAMES.ACCOUNTS}
      SET
        balance = balance + ${amount}
      WHERE
        account_number = ${accountNum}
    `
  }
  
  async function transferAmount(connection, amount, sender, reciever, remark) {
      //promisify query
    const execQuery = util.promisify(connection.query.bind(connection))

    try {
        //Start a transaction to get access to rollback and commit
      await execQuery("START TRANSACTION");

      //Negative amount from sender and positive to reciever
      await execQuery(adjustAmount(-amount, sender));
      await execQuery(adjustAmount(amount, reciever));

      //Register change in account_changes table
      await execQuery(`INSERT INTO ${NAMES.CHANGES} VALUES(null, ${reciever}, ${amount}, '2022-05-12', '${remark}')`);
      
    } catch (error) {
      console.log("transaction failed: ", error);

      //Rollback transaction at error
      execQuery(`ROLLBACK;`);
    } finally {
        //Commit transaction if only there were no errors
      execQuery(`COMMIT;`);
    }
  }

  module.exports = transferAmount;