const db = require("../src/model/dbConnectivity");

beforeAll(async () => await db.createConnection());
afterEach(async () => await db.clear());
afterAll(async () => await db.disconnect());
