const path = require("path");
const { readFile } = require("fs");
const mysql = require("mysql2");

module.exports.readCredentials = () => {
  return new Promise((resolve, reject) => {
    readFile(
      path.resolve(__dirname, "../../", "credentials.json"),
      "utf-8",
      (error, data) => {
        if (error) reject(error);
        const credentials = JSON.parse(data);
        resolve(credentials);
      }
    );
  });
};
module.exports.createConnection = () => {
  return new Promise(async (resolve, reject) => {
    const newConnection = mysql.createConnection(await this.readCredentials());
    resolve(newConnection);
  });
};

module.exports.clearUserTable = () => {
  return new Promise(async (resolve, reject) => {
    const connection = await this.createConnection();
    connection.execute("DELETE FROM user;", [], (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
};

module.exports.clear = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await this.clearUserTable();
    } catch (error) {
      reject(error);
    }
    resolve("tables cleared");
  });
};
//TODO refactor to remove clearUserTable since transaction table is deleted by cascade ON DELETE
module.exports.disconnect = (connection) => {
  return new Promise(async (resolve, reject) => {
    const successData = await connection.end();
    resolve(successData);
  });
};
