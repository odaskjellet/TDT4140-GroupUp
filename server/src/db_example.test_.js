const {NumbersDB} = require('./db_example.js');

/**
 * Jest docs: https://jestjs.io/docs/getting-started
 */

let db;

beforeEach(() => {
  db = new NumbersDB(':memory:'); // Running DB in memory to skip file handling
});

test('db starts empty', () => {
  expect(db.getNumbers()).toEqual([]);
});

test('a number can be inserted into db', () => {
  db.insertNumber(42);
  expect(db.getNumbers()).toEqual([{number: 42}]);
});

test('multiple numbers can be inserted into db', () => {
  db.insertNumber(0);
  db.insertNumber(5);
  expect(db.getNumbers()).toEqual([{number: 0}, {number: 5}]);
});

test('all numbers can be cleared from db', () => {
  expect(db.getNumbers()).toEqual([]);
  db.insertNumber(19);
  db.insertNumber(23);
  expect(db.getNumbers()).toEqual([{number: 19}, {number: 23}]);
  db.clearNumbers();
  expect(db.getNumbers()).toEqual([]);
});
