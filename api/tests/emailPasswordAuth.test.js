const { clear } = require("../src/model/dbConnectivity");
const { create } = require("../src/model/user");
const { verify } = require("../src/authentication/strategies/emailPassword");

const userData = {
  email: "esteban@abc.com",
  firstName: "esteban",
  lastName: "duran",
  password: "esteban12345",
};
let createdUserData;

beforeEach(async () => {
  await clear();
  createdUserData = await create(userData);
});

describe("Email-Password strategy", () => {
  it("should resolve with user data for email esteban@abc.com & password esteban12345", () => {
    return verify(userData.email, userData.password).then(
      (authenticatedUser) => {
        expect(authenticatedUser).toEqual(createdUserData);
      }
    );
  });
  it("should reject with 'user not found' for email unknown@abc.com", async () => {
    await expect(
      verify("unknown@abc.com", createdUserData.password)
    ).rejects.toBe("user not found");
  });
  it("should reject 'incorrect password' for email esteban@abc.com & password incorrect12345", async () => {
    await expect(verify(createdUserData.email, "incorrect12345")).rejects.toBe(
      "incorrect password"
    );
  });
});
