const { createConnection } = require("./dbConnectivity");
const { hash, compare } = require("../security/passwords");

const selectQuery =
  "SELECT first_name, last_name, email,balance, id, password FROM user WHERE id = ?;";
const selectByEmailQuery =
  "SELECT first_name, last_name, email,balance, id, password FROM user WHERE email = ?";
const insertQuery =
  "INSERT INTO user (first_name, last_name, email, password, balance) VALUES (?,?,?,?,?);";

module.exports.create = (userData) => {
  return new Promise(async (resolve, reject) => {
    const hashedPassword = await hash(userData.password);

    const connection = await createConnection();
    connection.execute(
      insertQuery,
      [
        userData.firstName,
        userData.lastName,
        userData.email,
        hashedPassword,
        0,
      ],
      async (error, results) => {
        if (error) return reject(error);
        connection.execute(
          selectQuery,
          [results.insertId],
          (error, results) => {
            if (error) return reject(error);
            const [createdUser] = results;
            connection.end();
            resolve(createdUser);
          }
        );
      }
    );
  });
};

module.exports.getById = (userId) => {
  return new Promise(async (resolve, reject) => {
    const connection = await createConnection();
    connection.execute(selectQuery, [userId], (error, results) => {
      if (error) return reject(error);
      const [userData] = results;
      connection.end();
      resolve(userData);
    });
  });
};

module.exports.getByEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    const connection = await createConnection();
    connection.execute(selectByEmailQuery, [userEmail], (error, results) => {
      if (error) return reject(error);
      const [userData] = results;
      connection.end();
      resolve(userData);
    });
  });
};
