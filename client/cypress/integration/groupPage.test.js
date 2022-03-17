import {cyan} from "@mui/material/colors";

describe('Pop up match info', () => {

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
                groupId: 'g2',
                description: 'En fin gruppe.',
                location: 'Oslo',
                membership: 'standard',
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gull_portrait_ca_usa.jpg/1280px-Gull_portrait_ca_usa.jpg',
                interests: ['Fishing', 'Golf'],
            }),
        });


        fetch('/api/match-groups', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                primaryId: 'g2',
                secondaryId: 'g1',
            }),
        }).then((res) => {
            if (res.ok) {
                console.log("ok");
            } else {
                // Did not create match
            }
        });

        fetch('/api/match-groups', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                primaryId: 'g1',
                secondaryId: 'g2',
            }),
        }).then((res) => {
            if (res.ok) {
                console.log("ok");
            } else {
                // Did not create match
            }
        });

        it('existing values should appear', () => {
            cy.visit('group/g1');
            cy.contains(/Visit/i).click();

            cy.contains(/Admin: henrik/i)
            cy.contains(/Location: Oslo/i)
            cy.contains(/Description: En fin gruppe./i)


        })


    })}