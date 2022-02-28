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
        '(groupId string, name string, admin string, description string, PRIMARY KEY (groupId))');
    this.stmt_create_table_groups.run();

    this.stmt_create_table_group_members = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupMembers (groupId string, username string, CONSTRAINT UC_GroupMember UNIQUE (groupId, username))');
    this.stmt_create_table_group_members.run();

    this.stmt_create_table_group_interests = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupInterests (groupId string, interest string)');
    this.stmt_create_table_group_interests.run();

    this.stmt_create_table_group_matches = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupMatches (primaryId string, secondaryId integer, CONSTRAINT UC_GroupMatches UNIQUE (primaryId, secondaryId))');
    this.stmt_create_table_group_matches.run();

    this.stmt_create_table_invitations_to_group = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
      'InvitationsToGroup (username string, groupId string, CONSTRAINT UC_Invitation UNIQUE (username, groupId))');
    this.stmt_create_table_invitations_to_group.run();

    this.stmt_get_users = this.db.prepare(
        'SELECT username FROM Users');

    this.stmt_get_user = this.db.prepare(
        'SELECT username, age, email, gender FROM Users WHERE username = ?');

    this.stmt_get_group = this.db.prepare(
        'SELECT * FROM Groups WHERE groupId = ?');

    this.stmt_get_groups = this.db.prepare(
        'SELECT groupId, name FROM Groups');

    this.stmt_get_groups_with_user = this.db.prepare(
        'SELECT groupId, name FROM GroupMembers JOIN Groups USING ' +
        '(groupId) WHERE GroupMembers.username = ?');

    this.stmt_get_group_members = this.db.prepare(
        'SELECT username FROM GroupMembers WHERE (groupId = ?)');

    this.stmt_get_group_interests = this.db.prepare(
        'SELECT interest FROM GroupInterests WHERE (groupId = ?)');

    this.stmt_get_group_matches = this.db.prepare(
        'SELECT groupId, name FROM Groups JOIN ' +
        '(SELECT secondaryId AS groupId FROM GroupMatches WHERE primaryId = ?' +
        'INTERSECT ' +
        'SELECT primaryId AS groupId FROM GroupMatches WHERE secondaryId = ?)' +
        'USING (groupId)');

    this.stmt_insert_user = this.db.prepare(
        'INSERT INTO Users (username, password, age, email, gender) ' +
        'VALUES (?, ?, ?, ?, ?)');

    this.stmt_insert_group = this.db.prepare(
        'INSERT INTO Groups (groupId, name, admin, description) ' +
        'VALUES (?, ?, ?, ?)');

    this.stmt_insert_user_into_group = this.db.prepare(
        'INSERT INTO GroupMembers (groupId, username) VALUES (?, ?)');

    this.stmt_match_groups = this.db.prepare(
        'INSERT INTO GroupMatches (primaryId, secondaryId) VALUES (?, ?)');

    this.stmt_try_login = this.db.prepare(
        'SELECT * FROM Users WHERE (username = ? AND password = ?)');

    this.stmt_insert_group_interest = this.db.prepare(
        'INSERT INTO GroupInterests (groupId, interest) VALUES (?, ?)');

    this.stmt_invite_user_to_group = this.db.prepare(
        'INSERT INTO InvitationsToGroup (username, groupId) VALUES (?, ?)',
    );

    this.stmt_delete_invitation = this.db.prepare(
        'DELETE FROM InvitationsToGroup WHERE (username = ? AND groupId = ?)',
    );

    this.stmt_get_invitation_to_group = this.db.prepare(
        'SELECT groupId, name FROM InvitationsToGroup JOIN Groups USING (groupId) WHERE (username = ?)',
    );
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

  insertGroup(groupId, name, admin, description) {
    this.stmt_insert_group.run(groupId, name, admin, description);
  }

  getGroup(groupId) {
    return this.stmt_get_group.get(groupId);
  }

  getGroups() {
    return this.stmt_get_groups.all();
  }

  getGroupsWithUser(username) {
    return this.stmt_get_groups_with_user.all(username);
  }

  addUserToGroup(groupId, username) {
    this.stmt_insert_user_into_group.run(groupId, username);
  }

  getGroupMembers(groupId) {
    return this.stmt_get_group_members.all(groupId);
  }

  getGroupInterests(groupId) {
    return this.stmt_get_group_interests.all(groupId);
  }

  addGroupInterest(groupId, interest) {
    this.stmt_insert_group_interest.run(groupId, interest);
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

  getGroupMatches(groupId) {
    return this.stmt_get_group_matches.all(groupId, groupId);
  }

  /**
   * Sends invitation to user
   * @param {string} username
   * @param {string} groupId
   */
  inviteUserToGroup(username, groupId) {
    this.stmt_invite_user_to_group.run(username, groupId);
    // det er vel en annen måte å sette default status i en database på
  }

  /**
   * Answers the invitation to a group.
   * If accepted, adds the user to the group.
   * If declined, removes the invitation.
   * @param {string} username
   * @param {string} answer
   * @param {string} groupId
   */
  answerGroupInvitation(username, accept, groupId) {
    this.stmt_delete_invitation.run(username, groupId);

    if (accept) {
      this.addUserToGroup(groupId, username);
    }
  }

  /**
   * Getter for a users invitations to groups
   */
  getUserInvitations(username) {
    return this.stmt_get_invitation_to_group.all(username);
  }
}

module.exports = {Database};
