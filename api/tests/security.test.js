const { hash, compare } = require("../src/authentication/passwords");
describe("Password hashing", () => {
  it("should hash user password", async () => {
    const userPassword = "esteban12345";
    const hashedPassword = await hash(userPassword);
    return compare(userPassword, hashedPassword).then((result) => {
      expect(result).toBe(true);
    });
  });
});
