const express = require('express');
const {Database} = require('./db.js');

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

server.put('/api/insert-user', (request, result) => {
  if (!db.tryLogin(request.body.username, request.body.password) &&
      validInformation(request.body.username, request.body.password, request.body.age, request.body.email)) {
    db.insertUser(request.body.username, request.body.password, request.body.age, request.body.email, request.body.gender);
    result.send('OK');
  } else {
    const errorData = alertErrors(registration_errors);
    result.status(400);
    console.log(errorData);
    result.send(JSON.stringify(errorData.error));
    clearErrors(registration_errors);
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
  console.log('\n\n\nBODY', request.body, '\n\n\n');
  if (validGroupname(request.body.name)) {
    db.insertGroup(request.body.groupId, request.body.name,
        request.body.admin, request.body.description, request.body.membership, request.body.location, request.body.image);
    db.addUserToGroup(request.body.groupId, request.body.admin);
    if (request.body.interests) {
      request.body.interests.forEach((interest) => {
        db.addGroupInterest(request.body.groupId, interest);
      })
    }
    result.send('OK');
  } else {
    const errorData = alertErrors(registration_errors);
    result.status(400);
    console.log(errorData);
    result.send(JSON.stringify(errorData.error));
    clearErrors(registration_errors);
  }
});

server.put('/api/get-group', (request, result) => {
  result.send(JSON.stringify(db.getGroup(request.body.groupId)));
});

server.put('/api/get-groups-with-user', (request, result) => {
  result.send(JSON.stringify(db.getGroupsWithUser(request.body.username)));
});

server.get('/api/get-groups', (request, result) => {
  result.send(JSON.stringify(db.getGroups()));
});

server.get('/api/get-users', (request, result) => {
  result.send(JSON.stringify(db.getUsers()));
});

server.put('/api/add-user-to-group', (request, result) => {
  db.addUserToGroup(request.body.groupId, request.body.username);
  result.send('OK');
});

server.put('/api/get-group-interests', (request, result) => {
  result.send(JSON.stringify(db.getGroupInterests(request.body.groupId)));
});

server.put('/api/get-group-members', (request, result) => {
  result.send(JSON.stringify(db.getGroupMembers(request.body.groupId)));
});

server.put('/api/insert-group-interest', (request, result) => {
  db.addGroupInterest(request.body.groupId, request.body.interest);
  result.send('OK');
});

server.put('/api/delete-group-interest', (request, result) => {
  db.deleteGroupInterest(request.body.groupId, request.body.interest);
  result.send('OK');
});

server.put('/api/match-groups', (request, result) => {
  db.matchGroups(request.body.primaryId, request.body.secondaryId);
  result.send('OK');
});

server.put('/api/get-group-matches', (request, result) => {
  result.send(JSON.stringify(db.getGroupMatches(request.body.groupId)));
});

server.put('/api/get-incomplete-group-matches', (request, result) => {
  result.send(
      JSON.stringify(db.getIncompleteGroupMatches(request.body.groupId)));
});

server.put('/api/get-invitations-with-user', (request, result) => {
  result.send(JSON.stringify(db.getUserInvitations(request.body.username)));
});

server.put('/api/invite-user-to-group', (request, result) => {
  db.inviteUserToGroup(request.body.username, request.body.groupId);
  result.send('OK');
});

server.put('/api/answer-invite', (request, result) => {
  db.answerGroupInvitation(request.body.username, request.body.accept, request.body.groupId);
  result.send('OK');
});

server.put('/api/get-group-invitations', (request, result) => {
  result.send(JSON.stringify(db.getGroupInvitations(request.body.groupId)));
});

server.put('/api/update-group-attributes', (request, result) => {
  db.updateGroupAttributes(request.body.groupId, request.body.name, request.body.description, request.body.location, request.body.image);
  result.send('OK');
});

server.put('/api/get-all-groups', (request, result) => {
  result.send(JSON.stringify(db.getAllGroups()));
});

server.put('/api/get-groups-with-interest', (request, result) => {
  result.send(JSON.stringify(db.getGroupWithInterest(request)));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const registration_errors = [];

function validInformation(username, password, age, email) {
  // Iterates over functions to get potential errors
  validUsername(username);
  validPassword(password);
  validAge(age);
  validEmail(email);
  if (registration_errors.length == 0) {
    return true;
  } else {
    return false;
  }
}

// Validation
function validUsername(username) {
  const regexPattern = /[A-Za-z]+$/i; // Regex only letters
  if (regexPattern.test(username)) {
    return true;
  } else {
    registration_errors.push('Username must only containt letters');
  }
}

function validPassword(password) {
  if (password.length >= 6) {
    return true;
  } else {
    registration_errors.push('Password must be atleast 6 characters long');
    return false;
  }
}

function validGroupname(groupname) {
  const regexPattern = /[A-Za-z]+$/i;
  if (regexPattern.test(groupname)) {
    return true;
  } else {
    registration_errors.push('Groupname must only contain letters');
    return false;
  }
}

function validAge(age) {
  if (parseInt(age) >= 18 && parseInt(age) <= 99) {
    return true;
  } else {
    registration_errors.push('You need to be between 18 and 99 years old.');
    return false;
  }
}

function validEmail(email) {
  // Splits on @, checks for two substrings
  const substrings = email.split('@');
  if (substrings.length == 2) {
    if ((substrings[0].length > 1) && (substrings[1].length > 1)) {
      // Splits on . Checks for two substrings
      const domainsubstring = substrings[1].split('.');
      if (domainsubstring.length == 2) {
        if (domainsubstring[0].length > 1 && domainsubstring[1].length > 1) {
          return true;
        } else {
          registration_errors.push('Must be a valid email! xx@yy.zz');
          return false;
        }
      } else {
        registration_errors.push('Must be a valid email! xx@yy.zz');
        return false;
      }
    } else {
      registration_errors.push('Must be a valid email! xx@yy.zz');
      return false;
    }
  } else {
    registration_errors.push('Must be a valid email! xx@yy.zz');
    return false;
  }
}

function alertErrors(registration_errors) {
  if (registration_errors.length != 0) {
    const output = registration_errors.join('\r\n');
    const outputJSON = {
      error: output,
    };
    return outputJSON;
  }
}

function clearErrors(registration_errors) {
  registration_errors.length = 0;
  output = '';
  return null;
}

let filteredGroups = [];

function filterGroups(filterOption, option) {
  let newGroups = [];
  switch(filterOption) {
    case interest:
        newGroups = db.getGroupWithInterest(option); //TODO test db.getGroupsWithInterests
        break;
    case location:
        newGroups = db.getGroupsAtLocation(option);
      break;
    case age:
      newGroups = db.getGroupsOfAge(option[0], option[1]);
      break;
    case groupSize:
      newGroups = db.getGroupsOfSize(option);
      break;
  }

  let intersection = newGroups.filter(x => filterGroups.includes(x));
  filterGroups = intersection;
}
