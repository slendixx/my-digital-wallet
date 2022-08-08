const bcrypt = require("bcrypt");

const saltRounds = 12;

module.exports.hash = (userPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(userPassword, saltRounds, (error, hash) => {
      if (error) return reject(error);
      resolve(hash);
    });
  });
};
module.exports.compare = (userPassword, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(userPassword, hashedPassword, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
