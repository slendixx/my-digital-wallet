const userModel = require("../src/model/user");
const { clear } = require("../src/model/dbConnectivity");
const model = require("../src/model/transaction");

const userData = {
  email: "esteban2@abc.com",
  firstName: "esteban",
  lastName: "duran",
  password: "esteban12345",
};
const transactionData1 = {
  amount: 100,
  type: "inbound",
  category: "other",
  description: "",
};
const transactionData2 = {
  amount: 50,
  type: "outbound",
  category: "taxes",
  description: "",
};
let createdUserData;
let transaction1Data;
let transaction2Data;
beforeEach(async () => {
  await clear();
  createdUserData = await userModel.create(userData);
  transactionData1.user_id = createdUserData.id;
  transactionData2.user_id = createdUserData.id;
  transaction1Data = await model.create(transactionData1);
  transaction2Data = await model.create(transactionData2);
  //user Balance is now 50
});
afterAll(async () => await clear());

describe("Transaction Model", () => {
  it("should create a transaction", async () => {
    return model.create(transactionData1).then(async (createdTransaction) => {
      expect(createdTransaction.id).toBeDefined();
      expect(createdTransaction.amount).toBe(transactionData1.amount);
      expect(createdTransaction.type).toBe(transactionData1.type);
      expect(createdTransaction.category).toBe(transactionData1.category);
      expect(createdTransaction.user_id).toBe(transactionData1.user_id);
      expect(createdTransaction.date).toBeDefined();

      const user = await userModel.getById(transactionData1.user_id);
      expect(user.balance).toBe(150);
    });
  });

  it("should delete a transaction by id and decrease user balance by the transaction amount", async () => {
    const createdTransaction = await model.create(transactionData1);
    const message = await model.delete(createdTransaction.id);
    expect(message).toBe("transaction deleted");
    const user = await userModel.getById(transactionData1.user_id);
    expect(user.balance).toBe(0);
  });

  it("should update amount, category, description by transaction id", async () => {
    transactionData1.user_id = transaction1Data.user_id;
    const createdTransaction = await model.create(transactionData1);
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

        const user = await userModel.getById(createdTransaction.user_id);
        expect(user.balance).toBe(250);
      });
  });
});

describe("Transaction get", () => {
  it("should get all transactions for a user id", async () => {
    //TODO refactor the next 3 lines to remove duplication

    return model.getByUserId(createdUserData.id).then((transactions) => {
      expect(transactions).toEqual([transaction1Data, transaction2Data]);
    });
  });
  it("should get all transactions for a user_id & category 'other' ", async () => {
    transactionData1.user_id = createdUserData.id;
    transactionData2.user_id = createdUserData.id;
    const transactionsData = [
      await model.create(transactionData1),
      await model.create(transactionData2),
    ];
    const queryOptions = {
      user_id: transactionsData[0].user_id,
      filters: [{ field: "category", value: "other" }],
    };
    return model.get(queryOptions).then((transactions) => {
      expect(transactions[0].category).toBe("other");
    });
  });
  it("should get all transactions for a user_id ordered by amount asc", async () => {
    transactionData1.user_id = createdUserData.id;
    transactionData2.user_id = createdUserData.id;
    const transactionsData = [
      await model.create(transactionData1),
      await model.create(transactionData2),
    ];
    const queryOptions = {
      user_id: transactionsData[0].user_id,
      order: { field: "amount", value: "asc" },
    };

    return model.get(queryOptions).then((transactions) => {
      expect(transactions[0].amount).toBe(50);
    });
  });
  it("should limit transactions to 1", async () => {
    transactionData1.user_id = createdUserData.id;
    transactionData2.user_id = createdUserData.id;
    const transactionsData = [
      await model.create(transactionData1),
      await model.create(transactionData2),
    ];
    const queryOptions = {
      user_id: transactionsData[0].user_id,
      limit: 1,
    };

    return model.get(queryOptions).then((transactions) => {
      expect(transactions.length).toBe(1);
    });
  });
  it("should limit transactions read to 2 with an offset of 1", async () => {
    const queryOptions = {
      user_id: transaction1Data.user_id,
      limit: 2,
      offset: 1,
    };

    return model.get(queryOptions).then((transactions) => {
      expect(transactions.length).toBe(1);
    });
  });
});

describe("TransactionQuery", () => {
  it("should create a query for a user_id 'inbound', 'other', order by date ASC, limit by 10 & offset by 5", () => {
    const userId = 1;
    const query = new model.TransactionQuery(userId)
      .filterBy("type", "inbound")
      .filterBy("category", "other")
      .orderBy("date", "asc")
      .limitTo(10)
      .offsetBy(5);
    query.prepareStatement();
    expect(query.innerSQL).toBe(
      "SELECT id,amount,type,category,description,user_id,date FROM transaction WHERE user_id = 1 AND type = 'inbound' AND category = 'other' ORDER BY date ASC LIMIT 10 OFFSET 5;"
    );
  });
  it("should create a query for a user_id", () => {
    const user_id = 1;
    const query = new model.TransactionQuery(user_id);
    query.prepareStatement();
    expect(query.innerSQL).toEqual(
      "SELECT id,amount,type,category,description,user_id,date FROM transaction WHERE user_id = 1 ORDER BY date ASC;"
    );
  });
});
