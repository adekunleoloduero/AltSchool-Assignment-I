const app = require('../../src/app');
const { getPath } = require('../../src/utilities');
const supertest = require('supertest');



const dbPath = getPath(__dirname, ['integration'], ['fixtures', 'stubs', 'users.json']);


describe('Route: /users/create, Method: POST', () => {
    it('Confirms that a valid input is sent in the request', async () => {
        const response = await supertest(app).post('/users/create').send(
            {
                "username": "testOneOkan",
                "password": "test1"
            }
        );
        expect(response.statusCode).toBe(201);
        expect(response.text).toBe(JSON.stringify({ message: "Thanks for registering. Your details have been saved." }));
    });

    it ('Checks if a username is provided', async () => {
        const response = await supertest(app).post('/users/create').send(
            {
                "password": "test1"
            }
        );
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, choose a username." }));
    });

    it ('Checks if a password is provided', async () => {
        const response = await supertest(app).post('/users/create').send(
            {
                "username": "testOne",
            }
        );
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, create a password." }));
    });

    it ('Checks if username provided is not already used', async () => {
        const response = await supertest(app).post('/users/create').send(
            {
                "username": "testOne",
                "password": "test1"
            }
        );
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Sorry, this username is no longer available." }));
    });
});