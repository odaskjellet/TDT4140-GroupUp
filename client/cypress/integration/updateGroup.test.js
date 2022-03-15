
describe('Update group', () => {

  it('should start empty, but with a user', async () => {
    await fetch('/api/debug/clear', {method: 'DELETE'});
    const result = await fetch('/api/get-users', {method: 'GET'})
        .then((res) => res.json());
    
    expect(result).to.be.empty;

    await fetch('/api/insert-user', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'myUsername',
        password: 'password123',
        age: '20',
        email: 'user@mail.com',
      }),
    });
    
    await fetch('/api/insert-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: 'groupA',
        admin: 'henrik',
        groupId: 'g1',
        description: 'En fin gruppe.',
        location: 'Oslo',
        membership: 'standard',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/1280px-Gull_portrait_ca_usa.jpg',
      }),
    });
  });

  it('should edit a group', () => {
    cy.visit('group/g1');
    
    cy.get('.MuiButton-root').contains(/Edit/i).click();
    cy.url().should('include', '/edit-group/g1');
  });

})