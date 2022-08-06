const model = require("../src/model/user");
const { clear } = require("../src/model/dbConnectivity");

afterEach(async () => await clear());

const userData = {
  email: "esteban@abc.com",
  firstName: "esteban",
  lastName: "duran",
  password: "esteban12345",
};
describe("User Model", () => {
  it("should create user and return it's data", () => {
    return model.create(userData).then((createdUser) => {
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.first_name).toBe(userData.firstName);
      expect(createdUser.last_name).toBe(userData.lastName);
      expect(createdUser.balance).toBe(0);
      expect(createdUser.password).not.toBe(userData.password);
    });
  });

  it("should get user by it's id", async () => {
    const createdUser = await model.create(userData);

    return model.getById(createdUser.id).then((userData) => {
      expect(userData).toEqual(createdUser);
    });
  });
});
