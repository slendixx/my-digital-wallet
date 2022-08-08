const model = require("../src/model/user");
const { clear } = require("../src/model/dbConnectivity");

beforeEach(async () => await clear());
afterAll(async () => await clear());

const userData = {
  email: "esteban1@abc.com",
  firstName: "esteban",
  lastName: "duran",
  password: "esteban12345",
};
//TODO refactor to remove duplication
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
  it("should get user by it's email", async () => {
    const createdUser = await model.create(userData);

    return model.getByEmail(createdUser.email).then((userData) => {
      expect(createdUser.id).toBe(userData.id);
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.firstName).toBe(userData.first_Name);
      expect(createdUser.lastName).toBe(userData.last_Name);
      expect(createdUser.balance).toBe(0);
    });
  });
});
