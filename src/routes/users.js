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


userRoutes.post('/create', async (req, res) => {
    const user = req.body;
    const users = await returnAllRecords(usersDbPath);
    let usersArray;
    let userId;
    
    //Run only for the first user to be registered
    if (!users) {
        usersArray = [];
        userId = 1;
        user.id = userId;
        usersArray.push(user);
    }

    usersArray = JSON.parse(users);

});


userRoutes.post('/authenticate_user', (req, res) => {
    res.send('Authenticate User');
});


userRoutes.get('/get_all_users', (req, res) => {
    res.send('Get all Users');
});



module.exports = userRoutes;