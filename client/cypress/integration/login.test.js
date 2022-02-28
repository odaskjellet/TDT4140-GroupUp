describe('Login page', () => {
  it('should start empty', async () => {
    await fetch('/api/debug/clear', {method: 'DELETE'});
    const result = await fetch('/api/get-users', {method: 'GET'})
        .then((res) => res.json());
    expect(result).to.be.empty;
  });

  it('Should not be able to login with dummy data', () => {
    cy.visit('/');
    cy.get('[data-testid="username-input"]').type('myUsername');
    cy.get('[data-testid="password-input"]').type('Password123');
    cy.get('[data-testid="login-button"]').click();
    cy.contains(/Wrong username or password!/i);
  });

  it('Username validation', () => {
    cy.visit('/');
    cy.get('[data-testid="username-input"]').type(' ');
    cy.get('[data-testid="password-input"]').type('Password123');
    cy.get('[data-testid="login-button"]').click();
    cy.contains(/A username is required./i);
  });

  it('Password validation', () => {
    cy.visit('/');
    cy.get('[data-testid="username-input"]').type('myUsername');
    cy.get('[data-testid="password-input"]').type('123');
    cy.get('[data-testid="login-button"]').click();
    cy.contains(/A password is required./i);
  });

  it('Create a sample user', async () => {
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
    await fetch('/api/insert-user', requestOptions);
    cy.get('[data-testid="username-input"]').clear();
    cy.get('[data-testid="username-input"]').type('testUser');
    cy.get('[data-testid="password-input"]').clear();
    cy.get('[data-testid="password-input"]').type('test123123');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/home');
  });
});
