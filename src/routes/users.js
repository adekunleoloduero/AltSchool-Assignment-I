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
usersRoute.post('/create', 
    (req, res, next) => {
        let message;
        let userInfo = req.body;
        if (!userInfo.firstname) {
            message = 'Please, enter your firstname.';
        } else if (!userInfo.lastname) {
            message = 'Please, enter your lastname.';
        } else if (!userInfo.username) {
            message = 'Please, enter a username.';
        } else if (!userInfo.password) {
            message = 'Please, enter a password.';
        } else if (!userInfo.email) {
            message = 'Please, enter your email.';
        } else if (!userInfo.role) {
            message = 'Please, select a role.';
        } 
        
        //Check if there is an invalid input
        req.INVALID_INPUT = { message };
        if (req.INVALID_INPUT.message && req.INVALID_INPUT.message !== undefined) {
            res.statusCode = 400;
            res.json(req.INVALID_INPUT);
        } else {
            next();
        }
    }, 
    async (req, res, next) => {
        let message;
        const users = await returnAllRecords(usersDbPath);
        const userInfo = req.body;

        //Skip to the part where the very first user is created.
        if (!users) {
            next();
        }

        const usersArray = JSON.parse(users);
        const userFound = usersArray.find(savedUser => savedUser.username === userInfo.username);
        if (userFound) {
            message = 'Sorry, this username already exists.';
            req.INVALID_INPUT = { message };
            res.statusCode = 403;
            res.json(req.INVALID_INPUT);
        } else {
            next();
        }
    },
    async (req, res) => {
        const users = await returnAllRecords(usersDbPath);
        let usersArray;
        let userId;
        const userInfo = req.body;
        if (!users) {
            //Run only for the first user to be registered
            usersArray = [];
            userId = 1;
            userInfo.id = userId;
            usersArray.push(userInfo);
            writeToFile(usersDbPath, JSON.stringify(usersArray));
        } else { //Run for subsequent users
            usersArray = JSON.parse(users);
            userId = usersArray[usersArray.length - 1].id + 1;
            userInfo.id = userId;
            usersArray.push(userInfo);
            writeToFile(usersDbPath, JSON.stringify(usersArray));
        }
        message = `Hello ${userInfo.firstname}, thanks for registering.`;
        res.statusCode = 201;
        res.json({ message });
    }
);



usersRoute.post('/authenticateUser',
    async (req, res, next) => {
        try {
            const passwordAuthenticated = await passwordAuthentication(req, res, usersDbPath);
            if (!passwordAuthenticated) {
                res.statusCode = req.errorCode; //Added to req object in the passwordAuthentication  function
                res.json(req.errorMessage); //Added to req object in the passwordAuthentication  function
            } else {
                next();
            }
        } catch(error) {
            error.type = "Not Found"
            next(error);
        }
    },
    async (req, res, next) => {
        try {
            const users = await returnAllRecords(usersDbPath);
            const usersArray = JSON.parse(users);
            const userFound = usersArray.find(user => {
                if (user.username === req.body.username || user.email === req.body.email) {
                    return user;
                }
            });
            res.statusCode = 200;
            res.json({ message: `Welcome back ${userFound.firstname}.`});
        } catch(error) {
            error.type = "Not Found";
            next(error);
        }   
});



usersRoute.get('/getAllUsers', 
    async (req, res, next) => {
        const passwordAuthenticated = await passwordAuthentication(req, res, usersDbPath);
        if (!passwordAuthenticated) {
            res.statusCode = req.errorCode; //Added to req object in the passwordAuthentication  function
            res.json(req.errorMessage); //Added to req object in the passwordAuthentication  function
        } else {
            next();
        }
    }, 
    async (req, res, next) => {
        const adminAuthorized = await adminAuthorization(req, res, ['admin'], usersDbPath);
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


//Error handlging middleware
usersRoute.use((error, req, res, next) => {
    if (error.type == 'Not Found') {
        res.json({ message: 'Oops, something went wrong. Try again.'})
    }
});





//Exports
module.exports = usersRoute;