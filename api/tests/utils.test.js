const toMySQLDatetime = require("../src/utils/dates");
describe("Datetime", () => {
  it("should format Date(2022,07,0,0,0,0) (august 3rd) as 2022-08-03 00:00:00", () => {
    const formattedDate = toMySQLDatetime(new Date(2022, 7, 3, 0, 0, 0));
    expect(formattedDate).toMatch("2022-08-03 00:00:00");
  });
});
