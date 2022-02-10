const {Database} = require('./db.js');

/**
 * Jest docs: https://jestjs.io/docs/getting-started
 */

let db;

beforeEach(() => {
  db = new Database(':memory:'); // Running DB in memory to skip file handling
});


test('db starts empty', () => {
  expect(db.getUsers()).toEqual([]);
});

test('get user with username and age', () => {
  db.insertUser("henrik", "henrik123", 20);
  expect(db.getUsers()).toEqual([
    {
      username: "henrik",
    }
  ]);
});

test('try to login', () => {
  expect(db.tryLogin("henrik", "henrik123", 20)).toBe(false);
  db.insertUser("henrik", "henrik123");
  expect(db.tryLogin("henrik", "henrik123")).toBe(true);
});

test('try to get user info', () => {
  db.insertUser("henrik", "henrik123", 20);
  expect(db.getUserInfo()).toEqual([
    {
      username: "henrik",
      age: 20
    }
  ]);
});

test('get group', () => {
  db.insertGroup(1, "Gruppe");
  expect(db.getGroups()).toEqual([
    {
     id: 1,
     name: "Gruppe",
    }
  ]);
  });

test('get group memebers', () => {
  db.insertGroup(1, "Gruppe");
  db.insertUser("henrik", "henrik123", 20);
  db.insertUser("per", "henrik123", 20);
  db.addUserToGroup("per", 1);
  db.addUserToGroup("henrik", 1);
  expect(db.getGroupMembers(1)).toEqual([
  {"username": "per"},
  {"username": "henrik"}
  ])
})

/*
User (username, password, age)
Group (id, name)
MemberOfGroup(username, groupID)
*/
