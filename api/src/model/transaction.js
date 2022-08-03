const { createConnection } = require("./dbConnectivity");
const toMySQLDatetime = require("../utils/dates");
const insertQuery =
  "INSERT INTO transaction (amount,type,category,description,user_id,date) VALUES (?,?,?,?,?,?);";
const selectQuery =
  "SELECT id,amount,type,category,description,user_id,date FROM transaction WHERE id = ?;";
const deleteQuery = "DELETE FROM transaction";

module.exports.create = (transactionData) => {
  return new Promise(async (resolve, reject) => {
    const connection = await createConnection();
    const creationDate = new Date();
    connection.execute(
      insertQuery,
      [
        transactionData.amount,
        transactionData.type,
        transactionData.category,
        transactionData.description,
        transactionData.user_id,
        toMySQLDatetime(creationDate),
      ],
      (error, results) => {
        if (error) return reject(error);
        const { insertId } = results;
        connection.execute(selectQuery, [insertId], (error, results) => {
          if (error) return reject(error);
          const [createdTransaction] = results;
          connection.end();
          resolve(createdTransaction);
        });
      }
    );
  });
};

module.exports.delete = (transactionId) => {
  return new Promise(async (resolve, reject) => {
    const connection = await createConnection();
    connection.execute(deleteQuery, [transactionId], (error, results) => {
      if (error) return reject(error);
      connection.end();
      resolve("transaction deleted");
    });
  });
};
