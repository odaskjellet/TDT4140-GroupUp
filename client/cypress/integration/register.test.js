
describe('Register Page', () => {
  it('should start empty', async () => {
    await fetch('/api/debug/clear', {method: 'DELETE'});
    const result = await fetch('/api/get-users', {method: 'GET'})
        .then((res) => res.json());
    expect(result).to.be.empty;
  });

  it('should register a new user', () => {
    cy.visit('/register');
    cy.get('[data-testid="username-input"]').type('myUsername');
    cy.get('[data-testid="email-input"]').type('name@domain.com');
    cy.get('[data-testid="age-input"]').type(30);
    cy.findByText('Other').click();
    cy.findByText('Female').click();
    cy.get('[data-testid="password-input"]').type('Password123');
    cy.get('[data-testid="password-confirmation-input"]').type('Password123');
    cy.contains(/create account/i).click();
    cy.url().should('include', '/home');
  });

  it('should valide all inputs', () => {
    cy.visit('/register');
    cy.contains(/create account/i).click();
    cy.get('[data-testid="username-input"]').type('u'.repeat(42));
    cy.contains(/create account/i).click();
    cy.get('[data-testid="email-input"]').type('myEmail');
    cy.contains(/create account/i).click();
    cy.get('[data-testid="age-input"]').type(-1);
    cy.contains(/create account/i).click();
    cy.findByText('Other').click();
    cy.findByText('Female').click();
    cy.contains(/create account/i).click();
    cy.get('[data-testid="password-input"]').type('Password1');
    cy.get('[data-testid="password-confirmation-input"]').type('Password2');
    cy.contains(/create account/i).click();
    cy.get('[data-testid="username-input"]').clear().type('mySecondUsername');
    cy.contains(/create account/i).click();
    cy.get('[data-testid="email-input"]').clear().type('myEmail@domain.com');
    cy.contains(/create account/i).click();
    cy.get('[data-testid="age-input"]').clear().type(20);
    cy.contains(/create account/i).click();
    cy.get('[data-testid="password-confirmation-input"]')
        .clear().type('Password1');
    cy.contains(/create account/i).click();
    cy.url().should('include', '/home');
  });
});
