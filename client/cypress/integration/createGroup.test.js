

describe('Create group', () => {
  it('should start empty', async () => {
    await fetch('/api/debug/clear', {method: 'DELETE'});
    const result = await fetch('/api/get-users', {method: 'GET'})
        .then((res) => res.json());
    expect(result).to.be.empty;
  });

  sessionStorage.setItem('user.verified', true);
  sessionStorage.setItem('user.username', 'myUsername');

  it('Create valid group', () => {
    cy.visit('/home');
    cy.contains(/Create new group/i).click();
    cy.url().should('include', '/create-group');
    cy.get('[data-testid="group-name-input"]').type('MyCoolGroup');
    cy.get('[data-testid="description-input"]').type('VIDYA GAEMZ');
    cy.contains(/Create group/i).click();
    cy.contains(/Home/i).click();
  });

  it('Create invalid group', () => {
    cy.visit('/home');
    cy.contains(/Create new group/i).click();
    cy.url().should('include', '/create-group');
    cy.get('[data-testid="group-name-input"]').type('123');
    cy.get('[data-testid="description-input"]').type('VIDYA GAEMZ');
    cy.contains(/Create group/i).click();
    cy.contains(/Something went wrong!/i);
    cy.visit('/home');
  });

  it('Cannot add members when there are none', () => {
    cy.visit('/home');
    cy.contains(/Visit/i).click();
    cy.url().should('include', '/group/');
    cy.contains(/Add members/i).click();
    cy.contains(/There are noone to invite!/i);
    cy.get('.MuiButton-root').contains(/Invite/i).should('have.length', 0);
    cy.contains(/Cancel/i).click();
  });

  it('Add member', () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'testUser',
        password: 'test123123',
        age: '19',
        email: 'tester123@gmail.com',
      }),
    };
    fetch('/api/insert-user', requestOptions);
    cy.visit('/home');
    cy.contains(/Visit/i).click();
    cy.contains('myUsername');
    cy.url().should('include', '/group/');
    cy.contains(/Add members/i).click();
    cy.get('.MuiButton-root').contains(/Invite/i).should('have.length', 1);
    cy.get('.MuiButton-root').contains(/Invite/i).click();
    cy.get('.MuiButton-root').contains(/Invite/i).should('be.disabled');
    cy.contains(/Cancel/i).click();
    cy.contains(/invite sent!/i).then(() => {
      sessionStorage.setItem('user.verified', true);
      sessionStorage.setItem('user.username', 'testUser');
    });
    cy.visit('/home');
    cy.contains(/Accept/i).click();
    cy.contains(/Visit/i).click();
    cy.contains('myUsername');
    cy.contains('testUser');
  });
});
