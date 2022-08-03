const model = require("../src/model/user");
const { clear } = require("../src/model/dbConnectivity");
afterEach(async () => await clear());
describe("User Model", () => {
    it("should create user and return it's data", () => {
        const userData = {
            email: "esteban@abc.com",
            firstName: "esteban",
            lastName: "duran",
            password: "esteban12345",
        };
        return model.create(userData).then((createdUser) => {
            expect(createdUser.email).toBe(userData.email);
            expect(createdUser.first_name).toBe(userData.firstName);
            expect(createdUser.last_name).toBe(userData.lastName);
            expect(createdUser.balance).toBe(0);
        });
    });
});
