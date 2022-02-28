import { useContext } from "react";
import { UserContext } from "../../src/contexts/User";

describe('Matching Page', () => {

  it('should start empty', async () => {
    await fetch('/api/debug/clear', {method: 'DELETE'});
    const result = await fetch('/api/get-users', {method: 'GET'})
        .then((res) => res.json());
    expect(result).to.be.empty;
  });

  it('should be able to initiate a match', () => {
    const [userState, userDispatch] = useContext(UserContext);

    const users = [
      {
        username: 'userA',
        password: 'passwordA',
        email: 'userA@domain.com',
        age: '20',
        gender: 'other',
      },
      {
        username: 'userB',
        password: 'passwordB',
        email: 'userB@domain.com',
        age: '20',
        gender: 'other',
      },
    ]
    
    const groups = [
      {
        groupId: '0',
        name: 'GruppeA',
        admin: 'userA'
      },
      {
        groupId: '1',
        name: 'GruppeB',
        admin: 'userA'
      },
      {
        groupId: '2',
        name: 'GruppeC',
        admin: 'userB'
      },
    ];
    
    for (let data of users) {
      fetch('/api/insert-user', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
    }
    userDispatch({type: 'login', username: 'userA'});
    for (let data of groups) {
      fetch('/api/insert-group', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
    }

    cy.visit('/explore');
    cy.findByText('GruppeA');
    cy.findByText('GruppeB');
    cy.findByText('GruppeC');
  });
});