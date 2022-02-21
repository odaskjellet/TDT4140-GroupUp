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
  db.insertUser('henrik', 'henrik123', 20);
  expect(db.getUsers()).toEqual([
    {
      username: 'henrik',
    },
  ]);
});

test('try to login', () => {
  expect(db.tryLogin('henrik', 'henrik123', 20)).toBe(false);
  db.insertUser('henrik', 'henrik123');
  expect(db.tryLogin('henrik', 'henrik123')).toBe(true);
});

test('try to get user info', () => {
  db.insertUser('henrik', 'henrik123', 20, 'henrik@gmail.com', 'male');
  expect(db.getUser('henrik')).toEqual({
      username: 'henrik',
      age: 20,
      email: 'henrik@gmail.com',
      gender: 'male'
    });
});

test('get group', () => {
  db.insertGroup(1, 'Gruppe');
  expect(db.getGroups()).toEqual([
    {
      id: 1,
      name: 'Gruppe',
    },
  ]);
});

test('get group members', () => {
  db.insertGroup(1, 'Gruppe');
  db.insertUser('henrik', 'henrik123', 20);
  db.insertUser('per', 'henrik123', 20);
  db.addUserToGroup(1, 'per');
  db.addUserToGroup(1, 'henrik');
  expect(db.getGroupMembers(1)).toEqual([
    {'username': 'per'},
    {'username': 'henrik'},
  ]);
});

test('get groupinterest', () => {
  db.insertGroup(1, 'Gruppe');
  db.addGroupInterest(1, 'skiing');
  expect(db.getGroupInterests(1)).toEqual([
    {'interest': 'skiing'},
  ]);
  db.addGroupInterest(1, 'chess');
  db.addGroupInterest(1, 'running');
  expect(db.getGroupInterests(1)).toEqual([
    {'interest': 'skiing'},
    {'interest': 'chess'},
    {'interest': 'running'},
  ]);
});

test('matching groups', () => {
  db.insertGroup(1, 'Gruppe 1');
  db.insertGroup(2, 'Gruppe 2');

  db.matchGroups(1, 2);

  expect(db.getGroupMatches(1)).toEqual([]);
  expect(db.getGroupMatches(2)).toEqual([]);

  db.matchGroups(2, 1); // A complete match

  expect(db.getGroupMatches(1)).toEqual([
    {'id': 2},
  ]);
  expect(db.getGroupMatches(2)).toEqual([
    {'id': 1},
  ]);
});

/*
User (username, password, age)
Group (id, name)
MemberOfGroup(username, groupID)
Interests (interest)
GroupInterest (groupID, interest)
Matches (primaryGroupID, secondaryGroupID)
*/
