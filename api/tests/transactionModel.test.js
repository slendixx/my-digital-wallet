const userModel = require("../src/model/user");
const { clear } = require("../src/model/dbConnectivity");
const model = require("../src/model/transaction");
beforeEach(async () => await clear());
afterEach(async () => await clear());

const userData = {
  email: "esteban@abc.com",
  firstName: "esteban",
  lastName: "duran",
  password: "esteban12345",
};
const transactionData = {
  amount: 100,
  type: "incoming",
  category: "other",
  description: "",
};

describe("Transaction Model", () => {
  it("should create a transaction", async () => {
    const createdUserData = await userModel.create(userData);
    transactionData.user_id = createdUserData.id;

    const createdTransaction = await model.create(transactionData);
    expect(createdTransaction.id).toBeDefined();
    expect(createdTransaction.amount).toBe(transactionData.amount);
    expect(createdTransaction.type).toBe(transactionData.type);
    expect(createdTransaction.category).toBe(transactionData.category);
    expect(createdTransaction.user_id).toBe(transactionData.user_id);
    expect(createdTransaction.date).toBeDefined();

    const user = await userModel.getById(transactionData.user_id);
    expect(user.balance).toBe(100);
  });

  it("should delete a transaction by id and decrease user balance by the transaction amount", async () => {
    const createdUserData = await userModel.create(userData);
    transactionData.user_id = createdUserData.id;

    const createdTransaction = await model.create(transactionData);
    const message = await model.delete(createdTransaction.id);
    expect(message).toBe("transaction deleted");
    const user = await userModel.getById(transactionData.user_id);
    expect(user.balance).toBe(0);
  });

  it("should update amount, category, description by transaction id", async () => {
    const createdUserData = await userModel.create(userData);
    transactionData.user_id = createdUserData.id;
    const createdTransaction = await model.create(transactionData);
    //user.balance is now 100
    const newData = {
      id: createdTransaction.id,
      amount: 200,
      category: "taxes",
      description: "updated description",
    };
    return model
      .updateById(createdTransaction.id, newData)
      .then(async (updatedTransaction) => {
        expect(updatedTransaction.id).toBe(newData.id);
        expect(updatedTransaction.amount).toBe(newData.amount);
        expect(updatedTransaction.category).toBe(newData.category);
        expect(updatedTransaction.description).toBe(newData.description);

        const user = await userModel.getById(createdUserData.id);
        expect(user.balance).toBe(200);
      });
  });
});

describe("Transaction get", () => {
  it("should get all transactions for a user id", async () => {
    //TODO refactor the next 3 lines to remove duplication
    const createdUserData = await userModel.create(userData);
    transactionData.user_id = createdUserData.id;
    const transactionsData = [
      await model.create(transactionData),
      await model.create(transactionData),
    ];

    return model.getByUserId(createdUserData.id).then((transactions) => {
      expect(transactions).toEqual(transactionsData);
    });
  });
  // it("should get all transactions for a user_id filtered by category", () => {});
  // it("should get all transactions for a user_id filtered by type", () => {});
  // it("should get all transactions for a user_id filtered by type & category", () => {});
  // it("should get all transactions for a user_id from least recent to most recent", () => {});
});
