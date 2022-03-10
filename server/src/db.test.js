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
  db.insertGroup('g1', 'GruppeNavnA', 'AdminNavn', 'Kul gruppe');
  db.insertGroup('g2', 'GruppeNavnB', 'AdminNavn', 'Middels kul gruppe');
  expect(db.getGroups()).toEqual([
    {
      groupId: 'g1',
      name: 'GruppeNavnA',
    },
    {
      groupId: 'g2',
      name: 'GruppeNavnB',
    },
  ]);
  expect(db.getGroup('g1')).toEqual({
    groupId: 'g1',
    name: 'GruppeNavnA',
    admin: 'AdminNavn',
    description: 'Kul gruppe',
    location: null,
    image: null
  });
});


test('add users and get group members', () => {
  db.insertGroup('g1', 'Gruppe');
  db.insertUser('per', 'henrik123', 20);
  db.insertUser('henrik', 'henrik123', 20);
  db.addUserToGroup('g1', 'henrik');
  db.addUserToGroup('g1', 'per');
  expect(db.getGroupMembers('g1')).toEqual(expect.arrayContaining([
    {'username': 'henrik'},
    {'username': 'per'},
  ]));
});


test('get groups with user', () => {
  db.insertUser('henrik', 'henrik123', 20);
  db.insertUser('per', 'passord123', 21);

  db.insertGroup('g0', 'A');
  db.insertGroup('g1', 'B');
  db.insertGroup('g2', 'C');
  db.insertGroup('g3', 'D');

  db.addUserToGroup('g0', 'per');
  db.addUserToGroup('g1', 'per');
  db.addUserToGroup('g2', 'per');

  db.addUserToGroup('g0', 'henrik');
  db.addUserToGroup('g1', 'henrik');

  expect(db.getGroupsWithUser('per')).toEqual([
    {groupId: 'g0', name: 'A'},
    {groupId: 'g1', name: 'B'},
    {groupId: 'g2', name: 'C'},
  ]);
  expect(db.getGroupsWithUser('henrik')).toEqual([
    {groupId: 'g0', name: 'A'},
    {groupId: 'g1', name: 'B'},
  ]);
});

test('add and get group interests', () => {
  db.insertGroup('g1', 'Gruppe');
  db.addGroupInterest('g1', 'skiing');
  expect(db.getGroupInterests('g1')).toEqual([
    {'interest': 'skiing'},
  ]);
  db.addGroupInterest('g1', 'chess');
  db.addGroupInterest('g1', 'running');
  expect(db.getGroupInterests('g1')).toEqual([
    {'interest': 'skiing'},
    {'interest': 'chess'},
    {'interest': 'running'},
  ]);
});


test('match groups and get matches', () => {
  db.insertGroup('g1', 'Gruppe 1');
  db.insertGroup('g2', 'Gruppe 2');

  db.matchGroups('g1', 'g2'); // An incomplete match

  expect(db.getIncompleteGroupMatches('g1')).toEqual([
    {groupId: 'g2'}
  ]);
  expect(db.getIncompleteGroupMatches('g2')).toEqual([]);

  expect(db.getGroupMatches('g1')).toEqual([]);
  expect(db.getGroupMatches('g2')).toEqual([]);

  db.matchGroups('g2', 'g1'); // A complete match

  expect(db.getGroupMatches('g1')).toEqual([
    {groupId: 'g2', name: 'Gruppe 2'},
  ]);
  expect(db.getGroupMatches('g2')).toEqual([
    {groupId: 'g1', name: 'Gruppe 1'},
  ]);
  expect(db.getIncompleteGroupMatches('g1')).toEqual([
    {groupId: 'g2'}
  ]);
  expect(db.getIncompleteGroupMatches('g2')).toEqual([
    {groupId: 'g1'}
  ]);
  
});


test('get invitations for user', () => {
  db.insertGroup('g1', 'Gruppe 1');
  db.insertUser('henrik', 'henrik123', 20);
  db.insertUser('per', 'per123', 20);

  db.inviteUserToGroup('per', 'g1');
  expect(db.getGroupInvitations('g1')).toEqual([
    {username: 'per'},
  ]);
  db.answerGroupInvitation('per', true, 'g1');
  expect(db.getGroupInvitations('g1')).toEqual([]);

  expect(db.getGroupMembers('g1')).toEqual([
    {username: 'per'},
  ]);

  db.inviteUserToGroup('henrik', 'g1');
  
  db.answerGroupInvitation('henrik', false, 'g1');
  expect(db.getGroupMembers('g1')).toEqual([
    {username: 'per'},
  ]);
});

test('get group attributes', () => {
  db.insertUser('henrik', 'password123', 20)
  db.insertGroup('g1', 'Gruppe 1', 'henrik', 'En fin gruppe.', 'Oslo', 
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/1280px-Gull_portrait_ca_usa.jpg')
  const group = db.getGroup('g1')
  expect(group).toEqual({
    groupId: 'g1',
    name: 'Gruppe 1',
    admin: 'henrik',
    description: 'En fin gruppe.',
    location: 'Oslo',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/1280px-Gull_portrait_ca_usa.jpg'
  })
});

/*
User (username, password, age)
Group (groupId, name)
MemberOfGroup(username, groupID)
Interests (interest)
GroupInterest (groupID, interest)
Matches (primaryGroupID, secondaryGroupID)
*/
