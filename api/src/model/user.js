const { createConnection } = require("./dbConnectivity");
module.exports.create = (userData) => {
    return new Promise(async (resolve, reject) => {
        const connection = await createConnection();
        connection.execute(
            "INSERT INTO user (first_name, last_name, email, password, balance) VALUES (?,?,?,?,?);",
            [
                userData.firstName,
                userData.lastName,
                userData.email,
                userData.password,
                0,
            ],
            async (error, results) => {
                if (error) reject(error);
                connection.execute(
                    `
                SELECT 
                    first_name, last_name, email,balance 
                FROM user 
                WHERE
                    id = ?;
                `,
                    [results.insertId],
                    (error, results) => {
                        if (error) reject(error);
                        const [createdUser] = results;
                        resolve(createdUser);
                    }
                );
            }
        );
    });
};
