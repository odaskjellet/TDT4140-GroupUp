const express = require('express');
const {Database} = require('./db.js');

const PORT = 3001;
const server = express();
let db = new Database(
  process.argv[2] === 'test' ? ':memory:' : './data/database.db');

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// API tests: client/cypress/integration/api.test.js

server.get('/api/get', (request, result) => {
  result.send(JSON.stringify(db.getUsers()));
});

server.delete('/api/debug/clear', (request, result) => {
  db = new Database(
    process.argv[2] === 'test' ? ':memory:' : './data/database.db');
  result.send('OK');
})

server.get('/api/get_userinfo', (request, result) => {
  result.send(JSON.stringify(db.getUserInfo()));
});

server.put('/api/insert', (request, result) => {
  if (!db.tryLogin(request.body.username, request.body.password)
      && validUsername(request.body.username)
      && validPassword(request.body.password)) {
    db.insertUser(request.body.username, request.body.password);
    result.send('OK');
  } else {
    result.status(400).send(); // TODO: Return info about why the registration failed?
  }
});

server.put('/api/try_login', (request, result) => {
  if (db.tryLogin(request.body.username, request.body.password)) {
    result.send('OK');
  } else {
    result.status(400).send();
  }
});

server.put('/api/insert_group', (request, result) => {
  if (validGroupname(request.body.groupname)){
    db.insertGroup(request.body.id, request.body.name);
    result.send('OK');
  } else {
    result.status(400).send();
  }
});

server.get('/api/get_group', (request, result) => {
  result.send(JSON.stringify(db.getGroups()));
});

server.put('/api/insert_groupUser_relation', (request, result) => {
  db.addUserToGroup(request.body.username, request.body.groupID);
  result.send('OK');
});

server.get('/api/get_group_members', (request, result) => {
  result.send(JSON.stringify(db.getGroupMembers(request.body.groupID)));
});

server.get('/api/get_group_interests', (request, result) => {
  result.send(JSON.stringify(db.getGroupInterests(request.body.groupID)));
});

server.put('/api/insert_group_interests', (request,result) => {
  db.addGroupInterest(request.body.groupID, request.body.interest);
  result.send('OK');
});

server.put('/api/make_match', (request, result) => {
  db.makeMatch(request.body.primaryID, request.body.secondaryID);
  result.send('OK');
});

server.get('/api/get_matches', (request, result) => {
  result.send(JSON.stringify(db.getGroupMatches(request.body.primaryID)));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


function validUsername(username) {
  let regexPattern = /[A-Za-z]+$/i; // Regex only letters
  return regexPattern.test(username);
}

function validPassword(password) {
  return password.length > 6;
}

function validGroupname(groupname) {
  let regexPattern = /[A-Za-z]+$/i;   
  return regexPattern.test(groupname);
}
