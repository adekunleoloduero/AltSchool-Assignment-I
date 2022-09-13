const app = require('../../src/app');
const { getPath, returnAllRecords } = require('../../src/utilities');
const supertest = require('supertest');


const usersDbPath = getPath(__dirname, ['integration'], ['fixtures', 'stubs', 'users.json']);




describe('Route: /users/create, Method: POST', () => {
    it('Confirms that a valid input is sent in the request', async () => {
        const userDetails = {
            "username": "testMeji",
            "password": "test1"
        }

        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(201);
        expect(response.text).toBe(JSON.stringify({ message: "Thanks for registering. Your details have been saved." }));
    });

    it ('Checks if a username is provided', async () => {
        const userDetails = {
            "password": "badofor10"
        }

        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter a username." }));
    });

    it ('Checks if a password is provided', async () => {
        const userDetails = {
            "username": "badoforlife"
        }
        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter a password." }));
    });

    it ('Checks if username provided is not already used', async () => {
        const userDetails = {
            "username": "adekunle100",
            "password": "adekunlepass",
        }
        
        //Determine if username already exist



        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Sorry, this username already exists." }));
    });
});




describe('Route: /users/get_all, Method: GET', () => {
    it('Returns all users if request is by an admin', async() => {
        const users = await returnAllRecords(usersDbPath);
        const adminLoginDetails = {
            "username": "adekunle100",
            "password": "adekunlepass",
        }

        const response = await supertest(app).get('/users/getAllUsers').send(adminLoginDetails);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(users);
    });

});



