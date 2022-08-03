const db = require("../src/model/dbConnectivity");
describe("dbConnectivity", () => {
    it("should get db connection credentials", () => {
        return db.readCredentials().then((credentials) => {
            expect(credentials).toHaveProperty("host");
            expect(credentials).toHaveProperty("port");
            expect(credentials).toHaveProperty("user");
            expect(credentials).toHaveProperty("password");
            expect(credentials).toHaveProperty("database");
        });
    });

    it("should create a connection obejct to MySQL db", () => {
        return db.createConnection().then((successData) => {
            expect(successData).toBeDefined();
        });
    });
    it("connection should be initialized by createConnection", async () => {
        const createdConnection = await db.createConnection();
        expect(createdConnection).toEqual(db.connection);
    });
});
