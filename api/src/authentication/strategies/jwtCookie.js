const jwt = require("../jwt");
const { getById } = require("../../model/user");

module.exports.sign = (payload) => {
  return new Promise(async (resolve, reject) => {
    const token = jwt.sign(payload);
    resolve(token);
  });
};
module.exports.verify = (token) => {
  return new Promise(async (resolve, reject) => {
    let payload;
    try {
      payload = await jwt.verify(token);
    } catch (error) {
      return reject("invalid JWT");
    }
    const { userId } = payload;
    let user;
    try {
      user = await getById(userId);
    } catch (error) {
      return reject("user not found");
    }

    resolve(user);
  });
};
