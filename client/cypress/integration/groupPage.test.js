import { cyan } from "@mui/material/colors";

describe('Pop up match info'), () => {

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
            interests: ['Fishing', 'Golf'],
          }),
        });

        await fetch('/api/insert-group', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              name: 'groupB',
              admin: 'henrik',
              groupId: 'g1',
              description: 'En fin gruppe.',
              location: 'Oslo',
              membership: 'standard',
              image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/1280px-Gull_portrait_ca_usa.jpg',
              interests: ['Fishing', 'Golf'],
            }),
          });

        
    await fetch('/api/match-groups', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        primaryId: selectedGroupA.groupId,
        secondaryId: selectedGroupBId,
      }),
    }).then((res) => {
      if (res.ok) {
        setSnackbarOpen(true);
      } else {
        // Did not create match
      }
    });
    });

    cy.visit('home');
}