
describe('api', () => {
  it('should start empty', async () => {
    await fetch('/api/debug/clear', {method: 'DELETE'});
    const result = await fetch('/api/get-users', {method: 'GET'})
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
        age: '19',
        email: 'henrik123@gmail.com',
      }),
    };
    await fetch('/api/insert-user', requestOptions);
    const result = await fetch('/api/get-users', {method: 'GET'})
        .then((res) => res.json());
    expect(result).to.deep.equal([{username: 'henrik'}]);
  });

  it('should not be able to insert a user with invalid username', async () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'harald!',
        password: 'henrik123',
        age: '19',
        email: 'henrik123@gmail.com',
      }),
    };
    const result = await fetch('/api/insert-user', requestOptions);
    expect(result.status).to.equal(400);
  });

  it('should not be able to insert a user with invalid password', async () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'henriken',
        password: '123',
        age: '19',
        email: 'henrik123@gmail.com',
      }),
    };
    const result = await fetch('/api/insert-user', requestOptions);
    expect(result.status).to.equal(400);
  });

  it('should not be able to insert a user with invalid age', async () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'vladimir',
        password: 'cyka1337',
        age: '17',
        email: 'vladimir123@gmail.com',
      }),
    };
    const result = await fetch('/api/insert-user', requestOptions);
    expect(result.status).to.equal(400);
  });

  it('should not be able to insert a user with invalid email-address', async () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'elskersurdeit',
        password: 'glutenerfett',
        age: '29',
        email: 'v@g.com',
      }),
    };
    const result = await fetch('/api/insert-user', requestOptions);
    expect(result.status).to.equal(400);
  });

  it('should be able to log in', async () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'henrik',
        password: 'henrik123',
      }),
    };
    const result = await fetch('/api/try-login', requestOptions);
    expect(result.statusText).to.equal('OK');
  });

  it('should not be able to log in with wrong password', async () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'henrik',
        password: 'wrongPassword',
      }),
    };
    const result = await fetch('/api/try-login', requestOptions);
    expect(result.status).to.equal(400);
  });

  it('should not be able to log in with wrong username', async () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username: 'henrikk',
        password: 'henrik123',
      }),
    };
    const result = await fetch('/api/try-login', requestOptions);
    expect(result.status).to.equal(400);
  });

  it('should be able to insert group', async () => {
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: 'groupA',
        admin: 'henrik',
        groupId: 1,
      }),
      };
      await fetch('/api/insert-group', requestOptions);
      const result = await fetch('/api/get-groups', {method: 'GET'})
      .then((res) => res.json());
      expect(result).to.deep.equal([{groupId: 1, name: 'groupA'}])
  });

  it('should not be able to insert group with invalid groupname', async () => {
    const requestedOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: 'group1',
        admin: 'henrik',
        groupId: 2,
      }),
    };
    const result = await fetch('/api/insert-group', requestedOptions);
    expect(result.status).to.equal(400);
  });




});


