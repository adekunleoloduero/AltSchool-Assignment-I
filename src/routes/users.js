const express = require('express');
const app = require('../app');
const { getPath, writeToFile, returnAllRecords } = require('../utilities');
const bodyParser = require('body-parser');


//Router
const userRoutes = express.Router();


//Middlewares
// userRoutes.use(bodyParser.json());
userRoutes.use(express.json());


//File based database path
const usersDbPath = getPath(__dirname, 'routes', 'models', 'users.json');


userRoutes.get('/', (req, res) => {
    res.send('Users Page');
});


//POST: users/create (Register a new user)
userRoutes.post('/create', async (req, res) => {
    const user = req.body;
    let message;
    const users = await returnAllRecords(usersDbPath);
    let usersArray = JSON.parse(users);
    let inputValidated = false

    const userFound = usersArray.find(savedUser => savedUser.username === user.username)
    //Input validation
    if (!user.username) {
        message = 'Please, choose a username.';
    } else if (!user.password) {
        message = 'Please, create a password.';
    } else if (userFound) {
        message = 'Sorry, this username is no longer available.';
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
        message = 'Thanks for registering. Your details have been saved.'
        res.statusCode = 201;
    } else {
        res.statusCode = 400;
    }
    res.json({ message });
});


userRoutes.post('/authenticate_user', (req, res) => {
    res.send('Authenticate User');
});


userRoutes.get('/get_all_users', (req, res) => {
    res.send('Get all Users');
});



module.exports = userRoutes;