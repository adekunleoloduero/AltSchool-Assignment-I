const app = require('../../src/app');
const { getPath } = require('../../src/utilities');
const supertest = require('supertest');




describe('Route: /users/create, Method: POST', () => {
    it('Confirms that a valid input is sent in the request', async () => {
        const requestBody = {
            "username": "testMeji",
            "password": "test1"
        }

        const response = await supertest(app).post('/users/create').send(requestBody);
        expect(response.statusCode).toBe(201);
        expect(response.text).toBe(JSON.stringify({ message: "Thanks for registering. Your details have been saved." }));
    });

    it ('Checks if a username is provided', async () => {
        const requestBody = {
            "password": "test1"
        }

        const response = await supertest(app).post('/users/create').send(requestBody);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter a username." }));
    });

    it ('Checks if a password is provided', async () => {
        const requestBody = {
            "password": "test1"
        }
        const response = await supertest(app).post('/users/create').send(requestBody);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter a password." }));
    });

    it ('Checks if username provided is not already used', async () => {
        const requestBody = {
            "username": "testMeji",
            "password": "test1"
        }
        
        //Determine if username already exist



        const response = await supertest(app).post('/users/create').send(requestBody);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Sorry, this username already exists." }));
    });
});