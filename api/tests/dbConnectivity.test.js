const dbConnectivity = require("../src/model/dbConnectivity");
describe("dbConnectivity", () => {
    it("should get db connection credentials", () => {
        return dbConnectivity.readCredentials().then((credentials) => {
            expect(credentials).toHaveProperty("host");
            expect(credentials).toHaveProperty("port");
            expect(credentials).toHaveProperty("user");
            expect(credentials).toHaveProperty("password");
            expect(credentials).toHaveProperty("database");
        });
    });
});
