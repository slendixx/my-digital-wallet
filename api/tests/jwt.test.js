const { readSecret, sign, verify } = require("../src/authentication/jwt");
describe("JWT", () => {
  it("should read secret from file system", () => {
    return readSecret().then((secret) => {
      expect(secret).toBeDefined();
    });
  });
  it("should hash and verify JWT with payload: {userId: 0}", async () => {
    const userId = 0;

    const token = await sign({ userId });
    return verify(token).then((payload) => {
      expect(payload.userId).toBe(0);
    });
  });
});
