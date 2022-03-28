const SQLiteDB = require('better-sqlite3');

// DOCS: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md

/**
 * Database for the application.
 */
class Database {
  /**
   * Constructor for the database class.
   * @param {filename} filename: name of the file.
   * @param {verbose} verbose
   */
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
        '(groupId string, name string, admin string, description string, ' +
        'membership string, location string, image string,' +
        ' PRIMARY KEY (groupId))');
    this.stmt_create_table_groups.run();

    this.stmt_create_table_group_members = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupMembers (groupId string, username string,' +
        ' CONSTRAINT UC_GroupMember UNIQUE (groupId, username))');
    this.stmt_create_table_group_members.run();

    this.stmt_create_table_group_interests = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupInterests (groupId string, interest string)');
    this.stmt_create_table_group_interests.run();

    this.stmt_create_table_group_matches = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
        'GroupMatches (primaryId string, secondaryId integer,' +
        ' isSuperLike string,' +
        ' CONSTRAINT UC_GroupMatches UNIQUE (primaryId, secondaryId))');
    this.stmt_create_table_group_matches.run();

    this.stmt_create_table_invitations_to_group = this.db.prepare(
        'CREATE TABLE IF NOT EXISTS ' +
      'InvitationsToGroup (username string, groupId string,' +
        ' CONSTRAINT UC_Invitation UNIQUE (username, groupId))');
    this.stmt_create_table_invitations_to_group.run();

    this.stmt_get_users = this.db.prepare(
        'SELECT username FROM Users');

    this.stmt_get_user = this.db.prepare(
        'SELECT username, age, email, gender FROM Users WHERE username = ?');

    this.stmt_get_group = this.db.prepare(
        'SELECT * FROM Groups WHERE groupId = ?');

    this.stmt_get_all_groups = this.db.prepare(
        'SELECT * FROM Groups');

    this.stmt_get_groups = this.db.prepare(
        'SELECT groupId, name FROM Groups');

    this.stmt_get_groups_with_user = this.db.prepare(
        'SELECT groupId, name, membership FROM GroupMembers JOIN Groups' +
        ' USING (groupId) WHERE GroupMembers.username = ?');

    this.stmt_get_group_members = this.db.prepare(
        'SELECT username FROM GroupMembers WHERE (groupId = ?)');

    this.stmt_get_group_interests = this.db.prepare(
        'SELECT interest FROM GroupInterests WHERE (groupId = ?)');

    this.stmt_get_groups_with_interest = this.db.prepare(
        'SELECT groupID FROM GroupInterests WHERE (interest = ?)');

    this.stmt_get_group_matches = this.db.prepare(
        'SELECT groupId, name FROM Groups JOIN ' +
        '(SELECT secondaryId AS groupId FROM GroupMatches WHERE primaryId = ?' +
        'INTERSECT ' +
        'SELECT primaryId AS groupId FROM GroupMatches WHERE secondaryId = ?)' +
        'USING (groupId)');

    this.stmt_get_group_superlikes = this.db.prepare(
        'SELECT Groups.groupId, Groups.name FROM GroupMatches INNER' +
        ' JOIN Groups ON GroupMatches.secondaryId = Groups.groupId WHERE' +
        ' isSuperLike = \'true\' AND primaryId = ?');

    this.stmt_get_incomplete_group_matches = this.db.prepare(
        'SELECT secondaryId AS groupId FROM GroupMatches WHERE primaryId = ?');

    this.stmt_insert_user = this.db.prepare(
        'INSERT INTO Users (username, password, age, email, gender) ' +
        'VALUES (?, ?, ?, ?, ?)');

    this.stmt_insert_group = this.db.prepare(
        'INSERT INTO Groups (groupId, name, admin, description, membership,' +
        ' location, image) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)');

    this.stmt_insert_user_into_group = this.db.prepare(
        'INSERT INTO GroupMembers (groupId, username) VALUES (?, ?)');

    this.stmt_match_groups = this.db.prepare(
        'INSERT INTO GroupMatches (primaryId, secondaryId, isSuperLike)' +
        ' VALUES (?, ?, ?)');

    this.stmt_try_login = this.db.prepare(
        'SELECT * FROM Users WHERE (username = ? AND password = ?)');

    this.stmt_insert_group_interest = this.db.prepare(
        'INSERT INTO GroupInterests (groupId, interest) VALUES (?, ?)');

    this.stmt_remove_group_interest = this.db.prepare(
        'DELETE FROM GroupInterests WHERE groupId = ? AND interest = ?');

    this.stmt_invite_user_to_group = this.db.prepare(
        'INSERT INTO InvitationsToGroup (username, groupId) VALUES (?, ?)');

    this.stmt_delete_invitation = this.db.prepare(
        'DELETE FROM InvitationsToGroup WHERE (username = ? AND groupId = ?)');

    this.stmt_get_invitation_to_group = this.db.prepare(
        'SELECT groupId, name FROM InvitationsToGroup JOIN Groups USING' +
        ' (groupId) WHERE (username = ?)');

    this.stmt_get_group_invitations = this.db.prepare(
        'SELECT username FROM InvitationsToGroup WHERE groupId = ?');

    this.stmt_update_group_attributes = this.db.prepare(
        'UPDATE Groups SET name = ?, description = ?, location = ?, image = ?' +
        ' WHERE groupId = ?');

    this.stmt_get_groups_of_size = this.db.prepare(
        'SELECT groupId FROM (SELECT groupId, COUNT(*) AS size FROM' +
        ' groupMembers GROUP BY groupId) WHERE size >= ? AND size <= ?');

    this.stmt_get_groups_of_age = this.db.prepare(
        'SELECT groupId FROM (SELECT groupId, AVG(age) AS average FROM' +
        ' GroupMembers INNER JOIN Users ON GroupMembers.username =' +
        ' Users.username GROUP BY groupId) WHERE' +
        ' (average >= ? AND average <= ?)');

    this.stmt_get_groups_at_location = this.db.prepare(
        'SELECT groupId FROM Groups WHERE location = ?');

    this.stmt_get_group_membership = this.db.prepare(
        'SELECT membership FROM Groups WHERE groupId = ?',
    );

    this.stmt_downgrade_superlike = this.db.prepare(
        'UPDATE GroupMatches SET isSuperLike = \'false\'' +
        ' WHERE primaryId = ? AND secondaryId = ?');

    this.stmt_get_locations = this.db.prepare(
        'SELECT DISTINCT location FROM Groups',
    );

    this.stmt_get_interests = this.db.prepare(
        'SELECT DISTINCT interest FROM GroupInterests',
    );
  }


  /**
   * Format: [{username: string}, ...]
   * @return {*} all usernames in DB
   */
  getUsers() {
    return this.stmt_get_users.all();
  }


  /**
   * Format: {username: string, age: number, email: string, gender: string}
   * @param {username} username of the user we are getting.
   * @return {*} attributes of the user with the given username.
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
   * inserts a new group with the given parameters.
   * @param {groupId} groupId to be inserted.
   * @param {name} name to be inserted.
   * @param {admin} admin to be inserted.
   * @param {description} description to be inserted.
   * @param {membership} membership to be inserted.
   * @param {location} location to be inserted.
   * @param {image} image to be inserted.
   */
  insertGroup(groupId, name, admin, description,
      membership, location, image) {
    this.stmt_insert_group.run(
        groupId, name, admin, description, membership, location, image);
  }

  /**
   * Format: {id: string, name: string, admin: string,
   * description: string, membership: string}
   * @param {groupId} groupId: gets group with corresponding id
   * @return {*} attributes of the group with the given username
   */
  getGroup(groupId) {
    return this.stmt_get_group.get(groupId);
  }

  /**
   * Format: [{id: string, name: string}, ...]
   * @return {*} id and name of all groups
   */
  getGroups() {
    return this.stmt_get_groups.all();
  }

  /**
   * Format: [{id: string, name: string}, ...]
   * @param {username} username
   * @return {*} id and name of all groups which the given user is member of
   */
  getGroupsWithUser(username) {
    return this.stmt_get_groups_with_user.all(username);
  }


  /**
   * Adds the user to the given group
   * @param {groupId} groupId user should be added to.
   * @param {username} username of the user.
   */
  addUserToGroup(groupId, username) {
    this.stmt_insert_user_into_group.run(groupId, username);
  }


  /**
   * Format: [{username: string}]
   * @param {groupId} groupId which we are getting members from.
   * @return {*} usernames of all members of the given group
   */
  getGroupMembers(groupId) {
    return this.stmt_get_group_members.all(groupId);
  }


  /**
   * Format: [{interest: string}]
   * @param {groupId} groupId which we are getting interests from.
   * @return {*} the interests of the given group
   */
  getGroupInterests(groupId) {
    return this.stmt_get_group_interests.all(groupId);
  }

  /**
   * returns group filtered on interest
   * @param {interest} interest: be filtered on.
   * @return {*} groups that matches parameter.
   */
  getGroupWithInterest(interest) {
    return this.stmt_get_groups_with_interest.all(interest);
  }

  /**
   * returns group of given size.
   * @param {sizeLow} sizeLow: min parameter
   * @param {sizeHigh} sizeHigh: max parameter
   * @return {*} returns groups that matches parameter.
   */
  getGroupsOfSize(sizeLow, sizeHigh) {
    return this.stmt_get_groups_of_size.all(sizeLow, sizeHigh);
  }

  /**
   * Adds the given interest to the given group
   * @param {string} groupId
   * @param {string} interest
   */
  addGroupInterest(groupId, interest) {
    this.stmt_insert_group_interest.run(groupId, interest);
  }

  /**
   * Deletes the given interest from the given group.
   * @param {string} groupId
   * @param {string} interest
   */
  deleteGroupInterest(groupId, interest) {
    this.stmt_remove_group_interest.run(groupId, interest);
  }

  /**
   * Matches groups, one-way.
   * Groups have to match both ways to have a complete match.
   * @param {string} primaryId
   * @param {string} secondaryId
   * @param {string} isSuperLike
   */
  matchGroups(primaryId, secondaryId, isSuperLike) {
    this.stmt_match_groups.run(primaryId, secondaryId, isSuperLike);
  }


  /**
   * Format: [{groupId: string, name: string}, ...]
   * @param {groupId} groupId:
   * @return {*} the groups that the given groups has matched with
   */
  getGroupMatches(groupId) {
    return this.stmt_get_group_matches.all(groupId, groupId);
  }

  /**
   * Format: [{groupId: string, name: string}, ...]
   * @param {groupId} groupId: Superlikes associated to this groupId.
   * @return {*[]} returns the groups that have superliked
   */
  getSuperLikes(groupId) {
    const result = [];
    const matches = this.getGroupMatches(groupId);
    for (const group of this.stmt_get_group_superlikes.all(groupId)) {
      if (!matches.some((match) => group.groupId === match.groupId)) {
        result.push(group);
      }
    }
    return result;
  }

  /**
   * Downgrades a superlike
   * @param {primaryId} primaryId:
   * @param {secondaryId} secondaryId:
   */
  downgradeSuperlike(primaryId, secondaryId) {
    this.stmt_downgrade_superlike.run(primaryId, secondaryId);
  }

  /**
   * Format: [{groupId: string}, ...]
   * @param {groupId} groupId:
   * @return {*} all (incomplete and complete) group matches
   * with the given group
   */
  getIncompleteGroupMatches(groupId) {
    return this.stmt_get_incomplete_group_matches.all(groupId);
  }

  /**
   * Sends invitation to user
   * @param {string} username
   * @param {string} groupId
   */
  inviteUserToGroup(username, groupId) {
    this.stmt_invite_user_to_group.run(username, groupId);
  }

  /**
   * Answers the invitation to a group.
   * If accepted, adds the user to the group.
   * If declined, removes the invitation.
   * @param {string} username of the user.
   * @param {accept} accept: status if the user accepted.
   * @param {string} groupId of the group the user should be added to.
   */
  answerGroupInvitation(username, accept, groupId) {
    if (!this.getUserInvitations(username).some((e) => e.groupId === groupId)) {
      throw Error('Cannot answer an invitation that does not exist!');
    }
    if (accept) {
      this.addUserToGroup(groupId, username);
    }
    this.stmt_delete_invitation.run(username, groupId);
  }

  /**
   * Getter for a users invitations to groups
   * @param {username} username
   * @return {*} gets invitations that the user is involved in.
   */
  getUserInvitations(username) {
    return this.stmt_get_invitation_to_group.all(username);
  }

  /**
   * Format: [{username: string}, ...]
   * @param {groupId} groupId:
   * @return {*} the users who are currently invited to the given group
   */
  getGroupInvitations(groupId) {
    return this.stmt_get_group_invitations.all(groupId);
  }

  /**
   * @param {string} groupId
   * @param {string} name
   * @param {string} description
   * @param {string} location
   * @param {string} image
   *
   */
  updateGroupAttributes(groupId, name, description, location, image ) {
    this.stmt_update_group_attributes.run(
        name, description, location, image, groupId);
  }

  /**
   * function that gets all groups.
   * @return {*} return every group.
   */
  getAllGroups() {
    return this.stmt_get_all_groups.all();
  }

  /**
   * returns groups based on min and max age.
   * @param {lowAge} lowAge: min parameter.
   * @param {highAge} highAge: max parameter
   * @return {*} groups that fit the criteria.
   */
  getGroupsOfAge(lowAge, highAge) {
    return this.stmt_get_groups_of_age.all(lowAge, highAge);
  }

  /**
   * returns groups based on location.
   * @param {location} location: to be filtered on.
   * @return {*} groups that fit the criteria.
   */
  getGroupsAtLocation(location) {
    return this.stmt_get_groups_at_location.all(location);
  }

  /**
   * Format: {membership: string}
   * @param {groupId} groupId:
   * @return {*} the membership of the given group ('standard' or 'gold')
   */
  getGroupMembership(groupId) {
    return this.stmt_get_group_membership.get(groupId);
  }

  /**
   * Gets groups from all locations.
   * @return {*} a complete list of locations that different groups use.
   */
  getLocations() {
    return this.stmt_get_locations.all();
  }

  /**
   * gets all interests.
   * @return {*} returns a complete list of interests.
   */
  getInterests() {
    return this.stmt_get_interests.all();
  }
}

module.exports = {Database};
