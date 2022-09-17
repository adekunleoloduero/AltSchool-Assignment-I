const app = require('../../src/app');
const { getPath, returnAllRecords } = require('../../src/utilities');
const supertest = require('supertest');



const usersDbPath = getPath(__dirname, ['integration'], ['fixtures', 'stubs', 'users.json']);




describe('Route: /users/create, Method: POST', () => {
    it('Saves user detail if successful or returns expected message if username already exists', async () => {
        const userDetails = {
            "username": "testMeji",
            "password": "test1"
        }
        const users = await returnAllRecords(usersDbPath);
        const usersArray = JSON.parse(users);
        const userFound = usersArray.find(user => user.username === userDetails.username);
        const response = await supertest(app).post('/users/create').send(userDetails);
        
        if (userFound) {
            expect(response.status).toBe(400);
            expect(response.text).toBe(JSON.stringify({ message: "Sorry, this username already exists." }));
        } else {
            expect(response.statusCode).toBe(201);
            expect(response.text).toBe(JSON.stringify({ message: "Thanks for registering."}));
        }
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

});




describe('Route: /users/getAllUsers, Method: GET', () => {

    it('Returns all users if user is an admin', async() => {
        const users = await returnAllRecords(usersDbPath);
        const usersArray = JSON.parse(users);
        const adminLoginDetails = {
            "username": "adekunle100",
            "password": "adekunlepass",
        }

        const response = await supertest(app).get('/users/getAllUsers').send(adminLoginDetails);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(JSON.stringify(usersArray));
    });

    it('Fails with the expected message if user does not have admin role', async() => {
        const loginDetails = {
            "username": "pandorabet",
            "password": "pandbaba10",
        };

        const response = await supertest(app).get('/users/getAllUsers').send(loginDetails);
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe(JSON.stringify({ message: 'Access denied. Only admin users are permitted.' }));
    });

    it('Fails with the expected message if inadequate loging detail is provided', async() => {
        const loginDetails = {};

        const response = await supertest(app).get('/users/getAllUsers').send(loginDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: 'Username or password is missing.' }));
    });

    it('Fails with the expected message if invalid username is entered', async() => {
        const loginDetails = {
            "username": "adekunle10",
            "password": "adekunlepass",
        };

        const response = await supertest(app).get('/users/getAllUsers').send(loginDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: 'Username not found, please register.' }));
    });

    it('Fails with the expected message if invalid password is entered', async() => {
        const loginDetails = {
            "username": "adekunle100",
            "password": "adekunlepas",
        };

        const response = await supertest(app).get('/users/getAllUsers').send(loginDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: 'Wrong username or password.' }));
    });

});



