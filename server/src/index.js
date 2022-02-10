const { request } = require('express');
const express = require('express');
const {Database} = require('./db.js');

const PORT = 3001;
const server = express();
const db = new Database(
  process.argv[2] === 'test' ? ':memory:' : './data/database.db');


//TODO: API IS YET TO BE TESTED!
server.get('/api/get', (request, result) => {
  result.send(JSON.stringify(db.getUsers()));
});

server.get('/api/get_userinfo', (request, result) => {
  result.send(JSON.stringify(db.getUserInfo()));
});

server.put('/api/insert', (request, result) => {
  if (validUsername(request.params.username) && validPassword(request.params.password)){
    db.insertUser(request.params.username, request.params.password);
    result.send('OK');
  }
});

server.put('/api/try_login', (request, result) => {
  result.send(
    db.tryLogin(request.params.username, request.params.password)
  );
});

server.put('/api/insert_group', (request, result) => {
  if(validGroupname(request.params.groupname)){
    db.insertGroup(request.params.id, request.params.name);
    result.send('OK');
  }
});

server.get('/api/get_group', (request, result) => {
  result.send(JSON.stringify(db.getGroups()));
});

server.put('/api/insert_groupUser_relation', (request, result) => {
  db.addUserToGroup(request.params.username, request.params.groupID);
  result.send('OK');
});

server.get('/api/get_group_members', (request, result) => {
  result.send(JSON.stringify(db.getGroupMembers(request.params.groupID)));
});

server.get('/api/get_group_interests', (request, result) => {
  result.send(JSON.stringify(db.getGroupInterests(request.params.groupID)));
});

server.put('/api/insert_group_interests', (request,result) => {
  db.addGroupInterest(request.params.groupID, request.params.interest);
  result.send('OK');
});

server.put('/api/make_match', (request, result) => {
  db.makeMatch(request.params.primaryID, request.params.secondaryID);
  result.send('OK');
});

server.get('/api/get_matches', (request, result) => {
  result.send(JSON.stringify(db.getGroupMatches(request.params.primaryID)));
});


server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

function validUsername(username) {
  let regexPattern = '/^[A-Za-z]+$/';   //Regex only letters
  if (regexPattern.test(username)) {
    return true;
  }
  else {
    return false;
  }
}

function validPassword(password) {
  if (password.length > 6) {
    return true;
  }
  else {
    return false;
  }
}

function validGroupname(groupname) {
  let regexPattern = '/^[A-Za-z]+$/';   
  if (regexPattern.test(groupname)) {
    return true;
  }
  else {
    return false;
  }
}