const userModel = require("../src/model/user");
const { clear } = require("../src/model/dbConnectivity");
const model = require("../src/model/transaction");
beforeEach(async () => await clear());
afterEach(async () => await clear());
describe("Transaction Model", () => {
  it("should create a transaction", async () => {
    const userData = {
      email: "esteban@abc.com",
      firstName: "esteban",
      lastName: "duran",
      password: "esteban12345",
    };
    const createdUserData = await userModel.create(userData);
    const transactionData = {
      amount: 100,
      type: "incoming",
      category: "other",
      description: "",
      user_id: createdUserData.id,
    };
    return model.create(transactionData).then((createdTransaction) => {
      expect(createdTransaction.id).toBeDefined();
      expect(createdTransaction.amount).toBe(transactionData.amount);
      expect(createdTransaction.type).toBe(transactionData.type);
      expect(createdTransaction.category).toBe(transactionData.category);
      expect(createdTransaction.user_id).toBe(transactionData.user_id);
      expect(createdTransaction.date).toBeDefined();
    });
  });
  it("should delete a transaction by id and decrease user balance by the transaction amount", async () => {
    const userData = {
      email: "esteban@abc.com",
      firstName: "esteban",
      lastName: "duran",
      password: "esteban12345",
    };
    const createdUserData = await userModel.create(userData);
    const transactionData = {
      amount: 100,
      type: "incoming",
      category: "other",
      description: "",
      user_id: createdUserData.id,
    };
    const createdTransaction = await model.create(transactionData);
    const message = await model.delete(createdTransaction.id);
    expect(message).toBe("transaction deleted");
    const user = await userModel.getById(transactionData.user_id);
    expect(user.balance).toBe(0);
  });
});
