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

    this.stmt_create_groupUser_relationTable = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS GroupMembers (groupID integer, username string)');
    this.stmt_create_groupUser_relationTable.run();

    this.stmt_create_group_interest_relation_table = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS GroupInterests (groupID integer, interest string)');
    this.stmt_create_group_interest_relation_table.run();

    this.stmt_create_match_table = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS GroupMatches (primaryID integer, secondaryID integer)');
    this.stmt_create_match_table.run();

    this.stmt_get = this.db.prepare(
        'SELECT (username) FROM Users');

    this.stmt_get_userinfo = this.db.prepare(
        'SELECT username, age FROM Users');

    this.stmt_get_group = this.db.prepare(
        'SELECT id, name FROM Groups');

    this.stmt_get_group_members = this.db.prepare(
        'SELECT username FROM GroupMembers WHERE (groupID == ?)');

    this.stmt_get_group_interests = this.db.prepare(
        'SELECT interest FROM GroupInterests WHERE (groupID == ?)');

    this.stmt_get_matches = this.db.prepare(
        'SELECT secondaryID FROM GroupMatches WHERE (primaryID == ?)');

    this.stmt_insert = this.db.prepare(
        'INSERT INTO Users (username, password, age) VALUES (?, ?, ?)');

    this.stmt_insert_group = this.db.prepare(
        'INSERT INTO Groups (id, name) VALUES (?, ?)');

    this.stmt_insert_groupUser_relation = this.db.prepare(
        'INSERT INTO GroupMembers (groupID, username) VALUES (?, ?)');

    this.stmt_make_match = this.db.prepare(
        'INSERT INTO GroupMatches (primaryID, secondaryID) VALUES (?,?)');

    this.stmt_try_login = this.db.prepare(
        'SELECT * FROM Users WHERE (username == ? AND password == ?)');

    this.stmt_insert_group_interests = this.db.prepare(
        'INSERT INTO GroupInterests (groupID, interest) VALUES (?, ?)');
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

  addUserToGroup(username, groupID) {
    return this.stmt_insert_groupUser_relation.run(groupID, username);
  }

  getGroupMembers(groupID) {
    return this.stmt_get_group_members.all(groupID);
  }

  getGroupInterests(groupID) {
    return this.stmt_get_group_interests.all(groupID);
  }

  addGroupInterest(groupID, interest) {
    return this.stmt_insert_group_interests.run(groupID, interest);
  }

  makeMatch(primaryID, secondaryID) {
    this.stmt_make_match.run(secondaryID, primaryID);
    return this.stmt_make_match.run(primaryID, secondaryID);
  }

  getGroupMatches(primaryID) {
    return this.stmt_get_matches.all(primaryID);
  }
}

module.exports = {Database};
