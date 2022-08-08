const { getByEmail } = require("../../model/user");
const { compare } = require("../passwords");
module.exports.verify = (email, password) => {
  return new Promise(async (resolve, reject) => {
    const user = await getByEmail(email);
    if (!user) return reject("user not found");

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) return reject("incorrect password");

    resolve(user);
  });
};
