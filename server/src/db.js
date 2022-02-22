const SQLiteDB = require('better-sqlite3');

// DOCS: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md

class Database {
  constructor(filename, verbose=true) {
    this.db = new SQLiteDB(filename,
        {verbose: verbose ? (msg) => console.log('[DB] ' + msg) : null});

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
        'INTERSECT ' +
        'SELECT primaryId AS id FROM GroupMatches WHERE secondaryId = ?');

    this.stmt_insert_user = this.db.prepare(
        'INSERT INTO Users (username, password, age, email, gender) ' +
        'VALUES (?, ?, ?, ?, ?)');

    this.stmt_insert_group = this.db.prepare(
        'INSERT INTO Groups (id, name, admin, description) ' +
        'VALUES (?, ?, ?, ?)');

    this.stmt_insert_user_into_group = this.db.prepare(
        'INSERT INTO GroupMembers (groupId, username) VALUES (?, ?)');

    this.stmt_match_groups = this.db.prepare(
        'INSERT INTO GroupMatches (primaryId, secondaryId) VALUES (?, ?)');

    this.stmt_try_login = this.db.prepare(
        'SELECT * FROM Users WHERE (username = ? AND password = ?)');

    this.stmt_insert_group_interest = this.db.prepare(
        'INSERT INTO GroupInterests (groupId, interest) VALUES (?, ?)');
  }

  /**
   * Format: [{username: string}, ...]
   * @return all usernames in DB
   */
  getUsers() {
    return this.stmt_get_users.all();
  }

  /**
   * Format: {username: string, age: number, email: string, gender: string}
   * @param {string} username
   * @return attributes of the user with the given username
   */
  getUser(username) {
    return this.stmt_get_user.get(username);
  }

  /**
   * Inserts a new user with the given attributes
   * @param {string} username
   * @param {string} password
   * @param {number} age
   * @param {string} email
   * @param {string} gender
   */
  insertUser(username, password, age, email, gender) {
    this.stmt_insert_user.run(username, password, age, email, gender);
  }

  /**
   *
   * @param {string} username
   * @param {string} password
   * @return {boolean} if the username/password combination is valid
   */
  tryLogin(username, password) {
    return this.stmt_try_login.all(username, password).length > 0;
  }

  /**
   * Inserts a new group with the given attributes
   * @param {string} id
   * @param {string} name
   * @param {string} admin username
   * @param {string} description
   */
  insertGroup(id, name, admin, description) {
    this.stmt_insert_group.run(id, name, admin, description);
  }

  /**
   * Format: {id: string, name: string, admin: string, description: string}
   * @param {string} id
   * @return attributes of the group with the given username
   */
  getGroup(id) {
    return this.stmt_get_group.get(id);
  }

  /**
   * Format: [{id: string, name: string}, ...]
   * @return id and name of all groups
   */
  getGroups() {
    return this.stmt_get_groups.all();
  }

  /**
   * Format: [{id: string, name: string}, ...]
   * @param {string} username
   * @return id and name of all groups which the given user is member of
   */
  getGroupsWithUser(username) {
    return this.stmt_get_groups_with_user.all(username);
  }

  /**
   * Adds the user to the given group
   * @param {string} groupId
   * @param {string} username
   */
  addUserToGroup(groupId, username) {
    this.stmt_insert_user_into_group.run(groupId, username);
  }

  /**
   * Format: [{username: string}]
   * @param {string} id
   * @return usernames of all members of the given group
   */
  getGroupMembers(id) {
    return this.stmt_get_group_members.all(id);
  }

  /**
   * Format: [{interest: string}]
   * @param {string} id
   * @return the interests of the given group
   */
  getGroupInterests(id) {
    return this.stmt_get_group_interests.all(id);
  }

  /**
   * Adds the given interest to the given group
   * @param {string} id
   * @param {string} interest
   */
  addGroupInterest(id, interest) {
    this.stmt_insert_group_interest.run(id, interest);
  }

  /**
   * Matches groups, one-way.
   * Groups have to match both ways to have a complete match.
   * @param {string} primaryId
   * @param {string} secondaryId
   */
  matchGroups(primaryId, secondaryId) {
    this.stmt_match_groups.run(primaryId, secondaryId);
  }

  /**
   * Format: [{id: string}, ...]
   * @param {string} id
   * @return the groups that the given groups has matched with
   */
  getGroupMatches(id) {
    return this.stmt_get_group_matches.all(id, id);
  }
}

module.exports = {Database};
