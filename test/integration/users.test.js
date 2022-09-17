const app = require('../../src/app');
const { getPath, returnAllRecords } = require('../../src/utilities');
const supertest = require('supertest');



const usersDbPath = getPath(__dirname, ['integration'], ['fixtures', 'stubs', 'users.json']);




describe('Route: /users/create, Method: POST', () => {
    it('Saves user information if successful or returns the expected error message if username already exists', async () => {
        const userDetails = {
            "firstname": "Sheriff Adekunle",
            "lastname": "Tajudeen",
            "username": "kunleoloduero",
            "password": "adekunle150",
            "email": "sat@gmail.com",
            "role": "admin"
        }
        const users = await returnAllRecords(usersDbPath);
        const usersArray = JSON.parse(users);
        const userFound = usersArray.find(user => user.username === userDetails.username);
        const response = await supertest(app).post('/users/create').send(userDetails);
        
        if (userFound) {
            expect(response.status).toBe(403);
            expect(response.text).toBe(JSON.stringify({ message: "Sorry, this username already exists." }));
        } else {
            expect(response.statusCode).toBe(201);
            expect(response.text).toBe(JSON.stringify({ message: `Hello ${userDetails.firstname}, thanks for registering.`}));
        }
    });


    it ('Returns the expected error message if username is not provided', async () => {
        const userDetails = {
            "firstname": "Ibukun",
            "lastname": "Ogunmola",
            "password": "ibkunkun20",
            "email": "ibukun@gmail.com",
            "role": "admin"
        }

        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter a username." }));
    });

    it ('Returns the expected error message if password is not provided', async () => {
        const userDetails = {
            "firstname": "James",
            "lastname": "Abayomi",
            "username": "jamjam10",
            "email": "jamesa@gmail.com",
            "role": "reader"
        }
        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter a password." }));
    });


    it ('Returns the expected error message if firstname is not provided', async () => {
        const userDetails = {
            "lastname": "Chukwuemeka",
            "username": "ifeanyichukwu1",
            "password": "ifeanyin123",
            "email": "ifeanyichukwu@gmail.com",
            "role": "reader"
        }
        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter your firstname." }));
    });

    it ('Returns the expected error message if lastname is not provided', async () => {
        const userDetails = {
            "firstname": "Danladi",
            "username": "danjunior",
            "password": "dandan123",
            "email": "dandikko@gmail.com",
            "role": "reader"
        }
        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter your lastname." }));
    });

    it ('Returns the expected error message if role is not specified', async () => {
        const userDetails = {
            "firstname": "Bolanle",
            "lastname": "Abiodun",
            "username": "bola4life",
            "password": "bolaab123",
            "email": "bola4life@gmail.com"
        }
        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, select a role." }));
    });

    it ('Returns the expected error message if email is not provided', async () => {
        const userDetails = {
            "firstname": "Efe",
            "lastname": "Aghogho",
            "username": "efeaghogo",
            "password": "effy123",
            "role": "reader"
        }
        const response = await supertest(app).post('/users/create').send(userDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter your email." }));
    });

});




describe('Route: /users/getAllUsers, Method: GET', () => {

    it('Returns all users if login details validates and current user has admin role', async() => {
        const users = await returnAllRecords(usersDbPath);
        const usersArray = JSON.parse(users);
        const adminLoginDetails = {
            "username": "kunleoloduero",
            "password": "adekunle150"
        }

        const response = await supertest(app).get('/users/getAllUsers').send(adminLoginDetails);
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(JSON.stringify(usersArray));
    });

    it('Returns the expected error message if user does not have admin role', async() => {
        const loginDetails = {
            "username": "janed",
            "password": "janny123",
        };

        const response = await supertest(app).get('/users/getAllUsers').send(loginDetails);
        expect(response.statusCode).toBe(401);
        expect(response.text).toBe(JSON.stringify({ message: 'Access denied. Only admin users are permitted.' }));
    });

    it('Returns the expected error message if inadequate loging detail was provided', async() => {
        const loginDetails = {};

        const response = await supertest(app).get('/users/getAllUsers').send(loginDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: 'Please, enter your login details.' }));
    });

    it('Returns the expected error message if invalid username is entered', async() => {
        const loginDetails = {
            "username": "adekunle10",
            "password": "adekunlepass",
        };

        const response = await supertest(app).get('/users/getAllUsers').send(loginDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: 'Invalid username or email.' }));
    });

    it('Returns the expected error message if invalid password is entered', async() => {
        const loginDetails = {
            "username": "janed",
            "password": "adekunlepas",
        };

        const response = await supertest(app).get('/users/getAllUsers').send(loginDetails);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: 'Wrong password for user.' }));
    });

});




describe('Route: /users/authenticateUser, Method: POST', () => {
   
    it('Signs in the user and returns the expected succces message if valid username/email with password was entered', async () => {
        const loginDetails = {
            "username": "kunleoloduero",
            "password": "adekunle150"
        }
        const users = await returnAllRecords(usersDbPath);
        const usersArray = JSON.parse(users);
        const userFound = usersArray.find((user) => {
            if (user.username === loginDetails.username || user.email === loginDetails.email) {
                return user;
            }
        });
        const response = await supertest(app).post('/users/authenticateUser').send(loginDetails);
        expect(response.status).toBe(200);
        expect(response.text).toBe(JSON.stringify({ message: `Welcome back ${userFound.firstname}.`}));
    });
    
    it('Returns the expected error message if login details is not provided', async () => {
        const loginDetails = {} //Missing login detail
       
        const response = await supertest(app).post('/users/authenticateUser').send(loginDetails);
        expect(response.status).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Please, enter your login details."}));
    });
    
    it('Returns the expected error message if invalid username/email is provided', async () => {
        const loginDetails = { //Missing or invalid username/email
            "username": "kunleoloduero10",
            "password": "adekunle150",
        }
        // const loginDetails = { //Missing or invalid username/email
        //     "password": "adekunle150",
        //     "email": "sat@gmail.com"
        // }
       
        const response = await supertest(app).post('/users/authenticateUser').send(loginDetails);
        expect(response.status).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Invalid username or email."}));
    });

    it('Returns the expected error message if invalid password is provided', async () => {
        const loginDetails = { //Wrong password
            "username": "janed",
            "password": "janny12"
        }

        // const loginDetails = { //Wrong password
        //     "email": "jad@gmail.com",
        //     "password": "janny12"
        // }
       
        const response = await supertest(app).post('/users/authenticateUser').send(loginDetails);
        expect(response.status).toBe(400);
        expect(response.text).toBe(JSON.stringify({ message: "Wrong password for user."}));
    });
});