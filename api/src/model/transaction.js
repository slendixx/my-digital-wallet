const { createConnection } = require("./dbConnectivity");
const toMySQLDatetime = require("../utils/dates");
const insertQuery =
  "INSERT INTO transaction (amount,type,category,description,user_id,date) VALUES (?,?,?,?,?,?);";
const selectQuery =
  "SELECT id,amount,type,category,description,user_id,date FROM transaction WHERE id = ?;";
const selectByUserIdQuery =
  "SELECT id,amount,type,category,description,user_id,date FROM transaction WHERE user_id = ?;";
const deleteQuery = "DELETE FROM transaction";
const updateQuery =
  "UPDATE transaction SET amount=?,category=?,description=? WHERE id = ?;";

module.exports.create = (transactionData) => {
  return new Promise(async (resolve, reject) => {
    const connection = await createConnection();
    const creationDate = new Date();
    connection.execute(
      insertQuery,
      [
        transactionData.amount,
        transactionData.type,
        transactionData.category,
        transactionData.description,
        transactionData.user_id,
        toMySQLDatetime(creationDate),
      ],
      (error, results) => {
        if (error) return reject(error);
        const { insertId } = results;
        connection.execute(selectQuery, [insertId], (error, results) => {
          if (error) return reject(error);
          const [createdTransaction] = results;
          connection.end();
          resolve(createdTransaction);
        });
      }
    );
  });
};

module.exports.delete = (transactionId) => {
  return new Promise(async (resolve, reject) => {
    const connection = await createConnection();
    connection.execute(deleteQuery, [transactionId], (error, results) => {
      if (error) return reject(error);
      connection.end();
      resolve("transaction deleted");
    });
  });
};

module.exports.updateById = (transactionId, newData) => {
  return new Promise(async (resolve, reject) => {
    const connection = await createConnection();

    connection.execute(
      updateQuery,
      [newData.amount, newData.category, newData.description, transactionId],
      (error, results) => {
        if (error) return reject(error);
        connection.execute(selectQuery, [transactionId], (error, results) => {
          if (error) return reject(error);
          const [createdTransaction] = results;
          connection.end();
          resolve(createdTransaction);
        });
      }
    );
  });
};

module.exports.getByUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    const connection = await createConnection();

    connection.execute(selectByUserIdQuery, [userId], (error, transactions) => {
      if (error) return reject(error);
      connection.end();
      resolve(transactions);
    });
  });
};
class TransactionQuery {
  static filters = [
    {
      field: "type",
      values: ["inbound", "outbound"],
    },
    {
      field: "category",
      values: ["other", "taxes"],
    },
  ];
  static orderFields = new Set(["date", "amount"]);

  constructor(userId) {
    this.innerSQL =
      "SELECT id,amount,type,category,description,user_id,date FROM transaction {filter} {order} {limit} {offset};";
    this.appliedFilters = [];
    this.orderField = "date";
    this.orderDirection = "asc";
    this.limitAmount = null;
    this.offsetAmount = null;
    this.userId = userId;
  }
  filterBy(field, value) {
    const isValidFilter = TransactionQuery.filters.some((filter) => {
      return (
        filter.field === field &&
        filter.values.some((filterValue) => {
          return filterValue === value;
        })
      );
    });
    if (!isValidFilter) return this;
    this.appliedFilters.push({ field, value });
    return this;
  }
  orderBy(field, direction) {
    if (!TransactionQuery.orderFields.has(field)) return this;
    this.orderField = field;
    if (!(direction === "asc" || direction === "des")) return this;
    this.orderDirection = direction;
    return this;
  }
  limitBy(amount) {
    if (amount < 0) return this;
    this.limitAmount = amount;
    return this;
  }
  offsetBy(amount) {
    if (amount < 0) return this;
    this.offsetAmount = amount;
    return this;
  }
  #prepareStatement() {
    const filters =
      "WHERE user_id = " +
      this.userId +
      " AND" +
      this.appliedFilters
        .map((filter, index) => {
          return `${index !== 0 ? "AND" : ""} ${filter.field} = '${
            filter.value
          }'`;
        })
        .join(" ");
    const order = `ORDER BY ${
      this.orderField
    } ${this.orderDirection.toUpperCase()}`;

    const limit = this.limitAmount !== null ? `LIMIT ${this.limitAmount}` : "";
    const offset =
      this.offsetAmount !== null ? `OFFSET ${this.offsetAmount}` : "";

    this.innerSQL = this.innerSQL
      .replace("{filter}", filters)
      .replace("{order}", order)
      .replace("{limit}", limit)
      .replace("{offset}", offset);
  }
  execute() {
    return new Promise(async (resolve, reject) => {
      this.#prepareStatement();
      const connection = await createConnection();
      connection.execute(this.innerSQL, [], (error, results) => {
        if (error) reject(error);
        resolve(results);
      });
    });
  }
}
module.exports.TransactionQuery = TransactionQuery;
