const {Database} = require('./db.js');

/*
  Jest docs: https://jestjs.io/docs/getting-started
*/

let db;

beforeEach(() => {
  db = new Database(':memory:', false);
  // Running DB in memory to skip file handling and without verbose
});


test('db starts empty', () => {
  expect(db.getUsers()).toEqual([]);
});


test('insert and get users', () => {
  db.insertUser('henrik', 'henrik123', 20);
  db.insertUser('per', 'per123', 21);
  expect(db.getUsers()).toEqual([
    {
      username: 'henrik',
    },
    {
      username: 'per',
    },
  ]);
});


test('try to login with username and password', () => {
  expect(db.tryLogin('henrik', 'henrik123', 20)).toBe(false);
  db.insertUser('henrik', 'henrik123');
  expect(db.tryLogin('henrik', 'henrik123')).toBe(true);
});


test('get user info', () => {
  db.insertUser('henrik', 'henrik123', 20, 'henrik@gmail.com', 'male');
  expect(db.getUser('henrik')).toEqual({
    username: 'henrik',
    age: 20,
    email: 'henrik@gmail.com',
    gender: 'male',
  });
});


test('insert and get groups', () => {
  db.insertGroup(1, 'GruppeNavnA', 'AdminNavn', 'Kul gruppe');
  db.insertGroup(2, 'GruppeNavnB', 'AdminNavn', 'Middels kul gruppe');
  expect(db.getGroups()).toEqual([
    {
      id: 1,
      name: 'GruppeNavnA',
    },
    {
      id: 2,
      name: 'GruppeNavnB',
    },
  ]);
  expect(db.getGroup(1)).toEqual({
    id: 1,
    name: 'GruppeNavnA',
    admin: 'AdminNavn',
    description: 'Kul gruppe',
  });
});


test('add users and get group members', () => {
  db.insertGroup(1, 'Gruppe');
  db.insertUser('henrik', 'henrik123', 20);
  db.insertUser('per', 'passord123', 21);
  db.addUserToGroup(1, 'per');
  db.addUserToGroup(1, 'henrik');
  expect(db.getGroupMembers(1)).toEqual([
    {'username': 'per'},
    {'username': 'henrik'},
  ]);
});


test('get groups with user', () => {
  db.insertUser('henrik', 'henrik123', 20);
  db.insertUser('per', 'passord123', 21);

  db.insertGroup(0, 'A');
  db.insertGroup(1, 'B');
  db.insertGroup(2, 'C');
  db.insertGroup(3, 'D');

  db.addUserToGroup(0, 'per');
  db.addUserToGroup(1, 'per');
  db.addUserToGroup(2, 'per');

  db.addUserToGroup(0, 'henrik');
  db.addUserToGroup(1, 'henrik');

  expect(db.getGroupsWithUser('per')).toEqual([
    {id: 0, name: 'A'},
    {id: 1, name: 'B'},
    {id: 2, name: 'C'},
  ]);
  expect(db.getGroupsWithUser('henrik')).toEqual([
    {id: 0, name: 'A'},
    {id: 1, name: 'B'},
  ]);
});

test('add and get group interests', () => {
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


test('match groups and get matches', () => {
  db.insertGroup(1, 'Gruppe 1');
  db.insertGroup(2, 'Gruppe 2');

  db.matchGroups(1, 2); // An incomplete match

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

