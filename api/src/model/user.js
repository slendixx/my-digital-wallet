const { createConnection } = require("./dbConnectivity");

const selectQuery =
    "SELECT first_name, last_name, email,balance, id FROM user WHERE id = ?;";
const insertQuery =
    "INSERT INTO user (first_name, last_name, email, password, balance) VALUES (?,?,?,?,?);";

module.exports.create = (userData) => {
    return new Promise(async (resolve, reject) => {
        const connection = await createConnection();
        connection.execute(
            insertQuery,
            [
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.password,
                0,
            ],
            //TODO implement password hashing
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
