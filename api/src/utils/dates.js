const toMySQLDatetime = (date) => {
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return date.toISOString().replace("T", " ").slice(0, 19);
};
module.exports = toMySQLDatetime;
