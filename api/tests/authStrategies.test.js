const { clear } = require("../src/model/dbConnectivity");
const { create } = require("../src/model/user");
const emailPasswordStrategy = require("../src/authentication/strategies/emailPassword");
const jsonwebtoken = require("jsonwebtoken");
const { readSecret } = require("../src/authentication/jwt");
const jwtCookieStrategy = require("../src/authentication/strategies/jwtCookie");

const userData = {
  email: "esteban4@abc.com",
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
  it("should resolve with user data for email esteban4@abc.com & password esteban12345", () => {
    return emailPasswordStrategy
      .verify(userData.email, userData.password)
      .then((authenticatedUser) => {
        expect(authenticatedUser).toEqual(createdUserData);
      });
  });
  it("should reject with 'user not found' for email unknown@abc.com", async () => {
    await expect(
      emailPasswordStrategy.verify("unknown@abc.com", createdUserData.password)
    ).rejects.toBe("user not found");
  });
  it("should reject 'incorrect password' for email esteban4@abc.com & password incorrect12345", async () => {
    await expect(
      emailPasswordStrategy.verify(createdUserData.email, "incorrect12345")
    ).rejects.toBe("incorrect password");
  });
});

describe("jwt-cookie sign", () => {
  it("should resolve with JWT for a userId", async () => {
    const token = await jwtCookieStrategy.sign({ userId: createdUserData.id });

    jsonwebtoken.verify(token, await readSecret(), (error, decodedToken) => {
      expect(decodedToken.userId).toBe(createdUserData.id);
    });
  });
});

describe("jwt-cookie verify", () => {
  it("should resolve with user data for a valid JWT", async () => {
    const token = await jwtCookieStrategy.sign({ userId: createdUserData.id });
    return jwtCookieStrategy.verify(token).then((userData) => {
      expect(createdUserData).toEqual(userData);
    });
  });
  it("should reject with 'invalid JWT' for wrong token", () => {
    const token = "notAValidJWT";
    expect(jwtCookieStrategy.verify(token)).rejects.toBe("invalid JWT");
  });
  it("should reject with 'user not found' for JWT with wrong id", async () => {
    const incorrectId = createdUserData.id + 1;
    const token = await jwtCookieStrategy.sign({ userId: incorrectId });

    expect(jwtCookieStrategy.verify(token)).rejects.toBe("user not found");
  });
  //TODO token issued before password change
  // it(
  //   "should reject with 'token issued before password change' for JWT with iat < passwordChangeTime"
  // ,()=>{

  // });
});
