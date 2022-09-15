const express = require('express');
const app = require('../app');
const { getPath, writeToFile, returnAllRecords } = require('../utilities');
const { auth } = require('../auth');
const bodyParser = require('body-parser');
const { response } = require('../app');



//Router
const usersRoute = express.Router();


//Middlewares
// userRoutes.use(bodyParser.json());
usersRoute.use(express.json());


//File based database path
// const usersDbPath = getPath(__dirname, ['routes'], ['models', 'users.json']); //For Production
const usersDbPath = getPath(__dirname, ['routes', 'src'], ['test', 'fixtures', 'stubs', 'users.json']); //For Testing


usersRoute.get('/', (req, res) => {
    res.send('Users Page');
});


//POST: users/create (Register a new user)
usersRoute.post('/create', async (req, res) => {
    const user = req.body;
    let message;
    const users = await returnAllRecords(usersDbPath);
    let usersArray = JSON.parse(users);
    let inputValidated = false

    const userFound = usersArray.find(savedUser => savedUser.username === user.username)
    //Input validation
    if (!user.username) {
        message = 'Please, enter a username.';
    } else if (!user.password) {
        message = 'Please, enter a password.';
    } else if (userFound) {
        message = 'Sorry, this username already exists.';
    } else {
        inputValidated = true;
    }

    //Run only for the first user to be registered
    if (inputValidated) {
        let userId;
        if (!users) {
            usersArray = [];
            userId = 1;
            user.id = userId;
            usersArray.push(user);
            writeToFile(usersDbPath, JSON.stringify(usersArray));
        } else {
            //Run if there are already records in the database
            userId = usersArray[usersArray.length - 1].id + 1;
            user.id = userId;
            usersArray.push(user);
            writeToFile(usersDbPath, JSON.stringify(usersArray));
        }
        message = 'Thanks for registering.'
        res.statusCode = 201;
    } else {
        res.statusCode = 400;
    }
    res.json({ message });
});


usersRoute.post('/authenticateUser', (req, res) => {
    res.send('Authenticate User');
});


//User authentication and admin level authorization
usersRoute.use(async (req, res, next) => {
    const loginDetails = req.body;
    let message;
    if (loginDetails.username === undefined || loginDetails.password === undefined) {
        message = 'Username or password is missing.';
        res.statusCode = 400;
        res.json( { message });
        return;
    }
    const users = await returnAllRecords(usersDbPath);
    const usersArray = JSON.parse(users);
    const userFound = usersArray.find(user => user.username === loginDetails.username);
    if (!userFound) {
        message = 'Username not found, please register.'
        res.statusCode = 400;
        res.json( { message });
        return;
    }

    if (userFound.password !== loginDetails.password) {
        message = 'Wrong username or password.'
        res.statusCode = 400;
        res.json( { message });
        return;
    }

    if (userFound.role === 'admin') {
        next();
    } else {
        message = 'Access denied. Only admins can view all users.'
        res.statusCode = 401;
        res.json({ message });
    }
});

usersRoute.get('/getAllUsers', async (req, res) => {
       const users =  await returnAllRecords(usersDbPath);
       const usersArray = JSON.parse(users);
    //    res.writeHead(200, { "Content-Type": "application/json" });
       res.json(usersArray);
    }
);



module.exports = usersRoute;