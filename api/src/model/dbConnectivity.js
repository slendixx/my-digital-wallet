const path = require("path");
const { readFile } = require("fs");

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
