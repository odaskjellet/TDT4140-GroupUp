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

    this.stmt_create_table_group_matches = this.db.prepare(
      'CREATE TABLE IF NOT EXISTS ' +
      'InvitationsToGroup (username string, invitationStatus string, groupId integer)');
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

    this.stmt_invite_user_to_group = this.db.prepare(
        "INSERT INTO InvitationsToGroup (username, invitationStatus, groupId) VALUES (?, 'Pending', ?)"
    );
    
    this.stmt_answer_invitation_to_group = this.db.prepare(
      'UPDATE InvitationsToGroup SET (invitationStatus = ?) WHERE (username = ? AND groupId = ?)'
    );

    this.stmt_delete_invitation_to_group = this.db.prepare(
      "DELETE FROM InvitationsToGroup (username = ? AND groupId = ? AND invitationStatus = 'Declined')" //er det slik man skriver string??
    );

    this.stmt_get_invitation_to_group = this.db.prepare(
      'SELECT * FROM InvitationsToGroup WHERE (username = ?)'
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

  /**
   * Matches groups, one-way.
   * Groups have to match both ways to have a complete match.
   * @param {string} primaryId 
   * @param {string} secondaryId 
   */
  matchGroups(primaryId, secondaryId) {
    this.stmt_match_groups.run(primaryId, secondaryId);
  }

  getGroupMatches(id) {
    return this.stmt_get_group_matches.all(id, id);
  }

  /**
   * Sends invitation to user
   * @param {string} username
   * @param {int} groupId
   */
  inviteUserToGroup(username, groupId) {
    this.stmt_invite_user_to_group.run(username, 'Pending', groupId); 
    //det er vel en annen måte å sette default status i en database på
  }

  /**
   * Answers the invitation to a group.
   * If accepted, adds the user to the group.
   * If declined, removes the invitation.
   * @param {string} username
   * @param {string} answer
   * @param {int} groupId
   */
  answerGroupInvitation(username, answer, groupId) {
    this.stmt_answer_invitation_to_group(username, answer, groupId);

    if(answer.equals('Accept')) {
      this.addUserToGroup(groupId, username);
    }
    else if(answer.equals('Decline')) {
      this.deleteInvitation(username, groupId);
    }

  }

  /**
   * Removes the invitation
   */
  deleteInvitation(username, groupId) {
    this.stmt_delete_invitation_to_group(username, groupId);
  }

  /**
   * Getter for a users invitations to groups
   */
  getUserInvitations(username) {
    this.stmt_get_invitation_to_group(username);
  }


}

module.exports = {Database};
