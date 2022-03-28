
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

  it('should not be able to insert a user with invalid email-address'
      , async () => {
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
    const exampleGroup = {
      name: 'groupA',
      admin: 'henrik',
      groupId: 'g1',
      description: 'En fin gruppe.',
      location: 'Oslo',
      membership: 'standard',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/1280px-Gull_portrait_ca_usa.jpg',
    };
    const requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(exampleGroup),
    };
    await fetch('/api/insert-group', requestOptions);
    const result = await fetch('/api/get-groups', {method: 'GET'})
        .then((res) => res.json());
    expect(result).to.deep.equal([{groupId: 'g1', name: 'groupA'}]);
    const requestOptions2 = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: 'g1'}),
    };
    const result2 = await fetch('/api/get-group', requestOptions2)
        .then((res) => res.json());
    expect(result2).to.deep.equal(exampleGroup);
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

  it('should be able to update group attributes', async () => {
    await fetch('/api/insert-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: 'g1',
        name: 'groupA',
        admin: 'henrik',
        description: 'En fin gruppe.',
        location: 'Oslo',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/1280px-Gull_portrait_ca_usa.jpg',
      }),
    });

    // Update
    await fetch('/api/update-group-attributes', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: 'g1',
        name: 'Nytt navn',
        description: 'Kul gruppe',
        membership: 'standard',
        location: 'Trondheim',
        image: '',
      }),
    });

    const result2 = await fetch('/api/get-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({groupId: 'g1'}),
    }).then((res) => res.json());

    expect(result2).to.deep.equal({
      groupId: 'g1',
      name: 'Nytt navn',
      admin: 'henrik',
      description: 'Kul gruppe',
      membership: 'standard',
      location: 'Trondheim',
      image: '',
    });
  });

  it('can add and remove group interests', async () => {
    await fetch('/api/insert-group', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: 'g2',
        name: 'Gruppe',
        admin: 'henrik',
      }),
    });

    await fetch('/api/insert-group-interest', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: 'g1',
        interest: 'chess',
      }),
    });

    const result = await fetch('/api/get-group-interests', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: 'g1',
      }),
    }).then((res) => res.json());

    expect(result).to.deep.equal([{interest: 'chess'}]);

    await fetch('/api/delete-group-interest', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: 'g1',
        interest: 'chess',
      }),
    });

    const result2 = await fetch('/api/get-group-interests', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        groupId: 'g1',
      }),
    }).then((res) => res.json());

    expect(result2).to.deep.equal([]);
  });

  it('should be able to superlike groups, and get superlikes for a given group'
      , async () => {
        await fetch('/api/match-groups', {
          method: 'PUT',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            primaryId: 'g1',
            secondaryId: 'g2',
            isSuperLike: 'true',
          }),
        });

        const result = await fetch('/api/get-group-superlikes', {
          method: 'PUT',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            groupId: 'g1',
          }),
        }).then((res) => res.json());
        expect(result).to.deep.equal([{groupId: 'g2', name: 'Gruppe'}]);
      });

  it('should be able to dowgrade the super like to a regular like'
      , async () => {
        await fetch('/api/downgrade-superlike', {
          method: 'PUT',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            primaryId: 'g1',
            secondaryId: 'g2',
          }),
        });

        const result = await fetch('/api/get-group-superlikes', {
          method: 'PUT',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
            groupId: 'g1',
          }),
        }).then((res) => res.json());
        expect(result).to.deep.equal([]);
      });


  it('should be able to match groups', async () => {
    await fetch('/api/match-groups', {
      method: 'PUT',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        primaryId: 'g2',
        secondaryId: 'g1',
      }),
    });


    const result = await fetch('/api/get-group-matches', {
      method: 'PUT',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({
        groupId: 'g1',
      }),
    }).then((res) => res.json());
    expect(result).to.deep.equal([{groupId: 'g2', name: 'Gruppe'}]);
  });
});
