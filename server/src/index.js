const express = require('express');
const {Database} = require('./db.js');

const PORT = 3001;
const server = express();
const db = new Database(
  process.argv[2] === 'test' ? ':memory:' : './data/database.db');

server.get('/api/get', (request, result) => {
  result.send(JSON.stringify(db.getUsers()));
});

server.put('/api/insert', (request, result) => {
  if (validUsername(request.params.username)){
    db.insertUser(request.params.username, request.params.password);
    result.send('OK');
  }
});

server.put('/api/try_login', (request, result) => {
  result.send(
    db.tryLogin(request.params.username, request.params.password)
  );
})

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

function validUsername(username) {
  let regexPattern = '/^[A-Za-z]+$/';      //Think this works, only letters for now. 
  if (regexPattern.test(username)) {
    return true;
  }
  else {
    return false;
  }
}