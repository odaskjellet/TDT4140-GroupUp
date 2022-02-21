const SQLiteDB = require('better-sqlite3');

// DOCS: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md

class Database {
  constructor(filename) {
    this.db = new SQLiteDB(filename,
        {verbose: (msg) => console.log('[DB] ' + msg)});

    this.stmt_create_table_users = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS Users ' +
        '(username string, password string, age integer, email string, ' +
        'gender string)');

    this.stmt_create_table_users.run();

    this.stmt_create_table_groups = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS Groups ' +
        '(id string, name string, admin string, description string)');
    this.stmt_create_table_groups.run();

    this.stmt_create_table_group_members = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupMembers (groupId string, username string)');
    this.stmt_create_table_group_members.run();

    this.stmt_create_table_group_interests = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupInterests (groupId string, interest string)');
    this.stmt_create_table_group_interests.run();

    this.stmt_create_table_group_matches = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupMatches (primaryId string, secondaryId integer)');
    this.stmt_create_table_group_matches.run();

    this.stmt_get_users = this.db.prepare(
        'SELECT username FROM Users');

    this.stmt_get_user = this.db.prepare(
        'SELECT username, age, email, gender FROM Users WHERE username = ?');
    
    this.stmt_get_group = this.db.prepare(
        'SELECT * FROM Groups WHERE id = ?');

    this.stmt_get_groups = this.db.prepare(
        'SELECT id, name FROM Groups');

    this.stmt_get_groups_with_user = this.db.prepare(
        'SELECT id, name FROM GroupMembers JOIN Groups WHERE ' +
        'GroupMembers.groupId = Groups.id AND GroupMembers.username = ?');

    this.stmt_get_group_members = this.db.prepare(
        'SELECT username FROM GroupMembers WHERE (groupId = ?)');

    this.stmt_get_group_interests = this.db.prepare(
        'SELECT interest FROM GroupInterests WHERE (groupId = ?)');

    this.stmt_get_group_matches = this.db.prepare(
        'SELECT secondaryId AS id FROM GroupMatches WHERE primaryId = ?' +
        'UNION SELECT primaryId AS id FROM GroupMatches WHERE secondaryId = ?');

    this.stmt_insert_user = this.db.prepare(
        'INSERT INTO Users (username, password, age, email, gender) ' +
        'VALUES (?, ?, ?, ?, ?)');

    this.stmt_insert_group = this.db.prepare(
        'INSERT INTO Groups (id, name, admin, description) ' +
        'VALUES (?, ?, ?, ?)');

    this.stmt_insert_user_into_group = this.db.prepare(
        'INSERT INTO GroupMembers (groupId, username) VALUES (?, ?)');

    this.stmt_match_groups = this.db.prepare(
        'INSERT INTO GroupMatches (primaryId, secondaryId) VALUES (?,?)');

    this.stmt_try_login = this.db.prepare(
        'SELECT * FROM Users WHERE (username = ? AND password = ?)');

    this.stmt_insert_group_interest = this.db.prepare(
        'INSERT INTO GroupInterests (groupId, interest) VALUES (?, ?)');
  }


  getUsers() {
    return this.stmt_get_users.all();
  }

  getUser(username) {
    return this.stmt_get_user.get(username);
  }

  insertUser(username, password, age, email, gender) {
    this.stmt_insert_user.run(username, password, age, email, gender);
  }

  tryLogin(username, password) {
    return this.stmt_try_login.all(username, password).length > 0;
  }

  insertGroup(id, name, admin, description) {
    this.stmt_insert_group.run(id, name, admin, description);
  }

  getGroup(id) {
    return this.stmt_get_group.get(id);
  }

  getGroups() {
    return this.stmt_get_groups.all();
  }

  getGroupsWithUser(username) {
    console.log(username, this.stmt_get_groups_with_user.all(username));
    return this.stmt_get_groups_with_user.all(username);
  }

  addUserToGroup(groupId, username) {
    this.stmt_insert_user_into_group.run(groupId, username);
  }

  getGroupMembers(id) {
    return this.stmt_get_group_members.all(id);
  }

  getGroupInterests(id) {
    return this.stmt_get_group_interests.all(id);
  }

  addGroupInterest(id, interest) {
    this.stmt_insert_group_interest.run(id, interest);
  }

  makeMatch(primaryId, secondaryId) {
    this.stmt_match_groups.run(primaryId, secondaryId);
  }

  getGroupMatches(id) {
    return this.stmt_get_group_matches.all(id, id);
  }
}

module.exports = {Database};
