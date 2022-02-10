
it('db should start empty', () => {
  fetch('/api/get', {method: 'GET'})
    .then(res => res.json())
    .then((result) => {
      result.should('have.length', 0);
    });
})

it('should be able to insert user', () => {
  fetch('/api/insert', {method: 'PUT', body: {
    username: 'henrik',
    password: 'henrik123'
  }});
  fetch('/api/get', {method: 'GET'})
    .then(res => res.json())
    .then((result) => {
      expect(result).to.equal([{username: 'henrik'}]);
    });
})
