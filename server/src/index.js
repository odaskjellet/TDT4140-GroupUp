const express = require('express');
const { Database } = require('./db.js');

const PORT = 3001;
const server = express();
let db = new Database(
  process.argv[2] === 'test' ? ':memory:' : './data/database.db');

server.use(express.json());
server.use(express.urlencoded({extended: true}));

// API tests: client/cypress/integration/api.test.js

server.get('/api/get-users', (request, result) => {
  result.send(JSON.stringify(db.getUsers()));
});

server.delete('/api/debug/clear', (request, result) => {
  db = new Database(
    process.argv[2] === 'test' ? ':memory:' : './data/database.db');
  result.send('OK');
});

server.put('/api/get-user', (request, result) => {
  result.send(JSON.stringify(db.getUser(request.body.username)));
});

server.put('/api/insert', (request, result) => {
  if (!db.tryLogin(request.body.username, request.body.password)
    && validUsername(request.body.username)
    && validPassword(request.body.password)
    && validAge(request.body.age)
    && validEmail(request.body.email)) {
    db.insertUser(request.body.username, request.body.password, request.body.age, request.body.email, request.body.gender);
    result.send('OK');
  } else {
    result.status(400).send();
    // TODO: Return info about why the registration failed?
  }
});

server.put('/api/try-login', (request, result) => {
  if (db.tryLogin(request.body.username, request.body.password)) {
    result.send('OK');
  } else {
    result.status(400).send();
  }
});

server.put('/api/insert-group', (request, result) => {
  if (validGroupname(request.body.groupname)) {
    db.insertGroup(request.body.id, request.body.name,
        request.body.admin, request.body.description);
    db.addUserToGroup(request.body.id, request.body.admin);
    result.send('OK');
  } else {
    result.status(400).send();
  }
});

server.put('/api/get-group', (request, result) => {
  result.send(JSON.stringify(db.getGroup(request.body.id)));
});

server.put('/api/get-groups-with-user', (request, result) => {
  result.send(JSON.stringify(db.getGroupsWithUser(request.body.username)));
});

server.get('/api/get-groups', (request, result) => {
  result.send(JSON.stringify(db.getGroups()));
});

server.put('/api/add-user-to-group', (request, result) => {
  db.addUserToGroup(request.body.groupId, request.body.username);
  result.send('OK');
});

server.get('/api/get-group-members', (request, result) => {
  result.send(JSON.stringify(db.getGroupMembers(request.body.groupId)));
});

server.get('/api/get-group-interests', (request, result) => {
  result.send(JSON.stringify(db.getGroupInterests(request.body.groupId)));
});

server.put('/api/insert-group-interest', (request, result) => {
  db.addGroupInterest(request.body.groupId, request.body.interest);
  result.send('OK');
});

server.put('/api/match-groups', (request, result) => {
  db.matchGroups(request.body.primaryId, request.body.secondaryId);
  result.send('OK');
});

server.put('/api/get-group-matches', (request, result) => {
  result.send(JSON.stringify(db.getGroupMatches(request.body.id)));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


//Validation
function validUsername(username) {
  const regexPattern = /[A-Za-z]+$/i; // Regex only letters
  return regexPattern.test(username);
}

function validPassword(password) {
  return password.length > 6;
}

function validGroupname(groupname) {
  const regexPattern = /[A-Za-z]+$/i;
  return regexPattern.test(groupname);
}

function validAge(age) {
  return age >= 18;
}

function validEmail(email) {
  //Splits on @, checks for two substrings
  let substrings = email.split("@");
  if (substrings.length == 2) {
    if ((substrings[0].length > 1) && (substrings[1].length > 1)) {
      //Splits on . Checks for two substrings
      let domainsubstring = substrings[1].split(".");
      if (domainsubstring.length == 2) {
        if (domainsubstring[0].length > 1 && domainsubstring[1].length > 1) {
          return true;
        }
      }
    }
  }
  else{
    return false;
  }
}


