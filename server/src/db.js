const SQLiteDB = require('better-sqlite3');

// DOCS: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md

class Database {
  constructor(filename) {
    this.db = new SQLiteDB(filename,
      {verbose: (msg) => console.log('[DB] ' + msg)});

    this.stmt_create = this.db.prepare(
      'CREATE TABLE IF NOT EXISTS Users (username string, password string, age integer)');
    this.stmt_create.run();

    this.stmt_create_group = this.db.prepare(
      'CREATE TABLE IF NOT EXISTS Groups (id integer, name string)');
      this.stmt_create_group.run();

    this.stmt_get = this.db.prepare(
      'SELECT (username) FROM Users');
    
    this.stmt_get_userinfo = this.db.prepare(
      'SELECT username, age FROM Users');
    
    this.stmt_get_group = this.db.prepare(
      'SELECT id, name FROM Groups'
    )

    this.stmt_insert = this.db.prepare(
      'INSERT INTO Users (username, password, age) VALUES (?, ?, ?)');

    this.stmt_insert_group = this.db.prepare(
      'INSERT INTO Groups (id, name) VALUES (?, ?)');

    this.stmt_try_login = this.db.prepare(
      'SELECT * FROM Users WHERE (username == ? AND password == ?)');
  }

  getUsers() {
    return this.stmt_get.all();
  }

  getUserInfo() {
    return this.stmt_get_userinfo.all();
  }

  insertUser(username, password, age) {
    this.stmt_insert.run(username, password, age);
  }

  tryLogin(username, password) {
    return this.stmt_try_login.all(username, password).length > 0;
  }

  insertGroup(id, name) {
    return this.stmt_insert_group.run(id, name);
  }

  getGroups() {
    return this.stmt_get_group.all();
  }

}

module.exports = {Database};
