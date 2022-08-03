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
        const newConnection = mysql.createConnection(
            await this.readCredentials()
        );
        this.connection = newConnection;
        resolve(newConnection);
    });
};

module.exports.connection = null;

module.exports.clearUserTable = () => {
    return new Promise((resolve, reject) => {
        this.connection.query("TRUNCATE TABLE user;", [], (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};
module.exports.clearTransactionTable = () => {
    return new Promise((resolve, reject) => {
        this.connection.query(
            "TRUNCATE TABLE transaction;",
            [],
            (error, results) => {
                if (error) reject(error);
                resolve(results);
            }
        );
    });
};
module.exports.clear = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await this.clearUserTable();
            await this.clearTransactionTable();
        } catch (error) {
            reject(error);
        }
        resolve("tables cleared");
    });
};
