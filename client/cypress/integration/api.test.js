
it('should be cleared', async () => {
  await fetch('/api/debug/clear', {method: 'DELETE'});
});

it('db should start empty', async () => {
  const result = await fetch('/api/get', {method: 'GET'})
      .then((res) => res.json());
  expect(result).to.be.empty;
});

it('should be able to insert user', async () => {
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: 'henrik',
      password: 'henrik123',
    }),
  };
  await fetch('/api/insert', requestOptions);
  const result = await fetch('/api/get', {method: 'GET'})
      .then((res) => res.json());
  expect(result).to.deep.equal([{username: 'henrik'}]);
});

it('should not be able to insert an invalid user', async () => {
  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: 'henrik!',
      password: 'henrik123',
    }),
  };
  const result = await fetch('/api/insert', requestOptions);
  expect(result.status).to.equal(400);
});
