const express = require('express');
const app = require('../app');
const { getPath, writeToFile, returnAllRecords } = require('../utilities');
const { passwordAuthentication, adminAuthorization } = require('../authentication');
const bodyParser = require('body-parser');



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



usersRoute.get('/getAllUsers', 
    async (req, res, next) => {
        const passwordAuthorized = await passwordAuthentication(req, res, usersDbPath);
        if (!passwordAuthorized) {
            console.log('ERROR', req.errorMessage)
            res.statusCode = req.errorCode; //Added to req object in the passwordAuthentication  function
            res.json(req.errorMessage); //Added to req object in the passwordAuthentication  function
        } else {
            next();
        }
    }, 
    async (req, res, next) => {
        const adminAuthorized = await adminAuthorization(req, res, ['admin'], usersDbPath);
        console.log(adminAuthorization);
        if (!adminAuthorized) {
            res.statusCode = req.errorCode; //Added to req object in the adminAuthorization  function
            res.json(req.errorMessage); //Added to req object in the adminAuthorization  function
        } else {
            next();
        }
    },
    async (req, res) => {
       const users =  await returnAllRecords(usersDbPath);
       const usersArray = JSON.parse(users);
       res.json(usersArray);
    }
);



//Exports
module.exports = usersRoute;