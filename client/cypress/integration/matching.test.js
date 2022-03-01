
describe('Matching Page', () => {
  it('should start empty', async () => {
    await fetch('/api/debug/clear', {method: 'DELETE'});
    const result = await fetch('/api/get-users', {method: 'GET'})
        .then((res) => res.json());
    expect(result).to.be.empty;
  });

  it('should be able to initiate a match', () => {
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
    ];

    const groups = [
      {
        groupId: '0',
        name: 'GruppeA',
        admin: 'userA',
      },
      {
        groupId: '1',
        name: 'GruppeB',
        admin: 'userB',
      },
      {
        groupId: '2',
        name: 'GruppeC',
        admin: 'userB',
      },
    ];

    for (const data of users) {
      fetch('/api/insert-user', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
    }

    // Hacky way to sign in
    sessionStorage.setItem('user.verified', true);
    sessionStorage.setItem('user.username', 'userA');

    for (const data of groups) {
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
    cy.findByText('GruppeB').parent().findByText('Match').click();
    cy.get('.MuiSelect-select').click();
    cy.get('.MuiList-root').findByText('GruppeA').click();
    cy.get('.MuiButton-root').contains(/Confirm/i).click();

    cy.contains('Match initiated!')
    
    cy.findByText('GruppeB').parent().findByText('Match').click();
    cy.get('.MuiSelect-select').click();
    cy.get('.MuiList-root').findByText('GruppeA').click();
    cy.get('.MuiButton-root').contains(/Match already initiated/i).parent().should('be.disabled');
    
    cy.get('.MuiButton-root').contains(/Cancel/i).click()
    .then(() => {
      sessionStorage.setItem('user.verified', true);
      sessionStorage.setItem('user.username', 'userB');
    });

    cy.visit('/explore');
    cy.findByText('GruppeA').parent().findByText('Match').click();
    cy.get('.MuiSelect-select').click();
    cy.get('.MuiList-root').findByText('GruppeB').click();
    cy.findByText('Confirm').click();
    cy.contains('Match initiated!');

    cy.visit('/group/0');
    cy.findByText('GruppeB');
    cy.visit('/group/1');
    cy.findByText('GruppeA');
  });
});
