const { MongoClient } = require("mongodb");
require("dotenv").config();
const client = new MongoClient(process.env.MONGODB_URL);

//Format date to yyyy-mm-dd
const getDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now
    .getMonth()
    .toString()
    .padStart(2, "0")}-${now.getDay().toString().padStart(2, "0")}`;
};

//Get length of our changes array from db
async function getChangesLength(coll, account_no) {
  try {
    const result = await coll.findOne({ account_no });
    return result.account_changes.length + 1;
  } catch (error) {
    console.error(error);
  }
}

//Get client from our index manager module
async function transfer(sendingAccount, receivingAccount, amount, remark) {
  await client.connect();
  const coll = client.db("databaseWeek4").collection("accounts");
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      //Update sender account and push the change to account_changes
      await coll.updateOne(
        { account_no: sendingAccount },
        {
          $inc: { balance: -amount },
          $push: {
            account_changes: {
              change_number: await getChangesLength(coll, sendingAccount),
              amount: -amount,
              date: getDate(),
              remark: remark,
            },
          },
        },
        { session }
      );

      //Update receiver account in the same way
      await coll.updateOne(
        { account_no: receivingAccount },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: await getChangesLength(coll, receivingAccount),
              amount: amount,
              date: getDate(),
              remark: remark,
            },
          },
        },
        { session }
      );
    });
  } catch (error) {
    //Abort on error
    session.abortTransaction();
  } finally {
    //Commit when everything ran well and close client
    await session.endSession();
    client.close();
  }
}

module.exports = { transfer };

//Test function to transfer amount
