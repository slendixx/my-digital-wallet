const { readFile } = require("fs");
const path = require("path");
const jsonwebtoken = require("jsonwebtoken");
module.exports.readSecret = () => {
  return new Promise((resolve, reject) => {
    readFile(
      path.resolve(__dirname, "../../jwtSecret.json"),
      "utf-8",
      (error, data) => {
        if (error) reject(error);
        const { JWTSecret } = JSON.parse(data);
        resolve(JWTSecret);
      }
    );
  });
};

module.exports.sign = (payload) => {
  return new Promise(async (resolve, reject) => {
    //token expires in 15 minutes = 900 seconds
    jsonwebtoken.sign(
      payload,
      await this.readSecret(),
      { expiresIn: 900 },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
};
module.exports.verify = (token) => {
  return new Promise(async (resolve, reject) => {
    jsonwebtoken.verify(token, await this.readSecret(), (error, payload) => {
      if (error) reject(error);
      resolve(payload);
    });
  });
};
