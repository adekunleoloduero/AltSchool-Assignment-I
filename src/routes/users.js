const express = require('express');



const userRoutes = express.Router();

userRoutes.get('/', (req, res) => {
    res.send('Users Page');
});


userRoutes.post('/create', (req, res) => {
    res.send('Create a user');
});


userRoutes.post('/authenticate_user', (req, res) => {
    res.send('Authenticate User');
});


userRoutes.get('/get_all_users', (req, res) => {
    res.send('Get all Users');
});



module.exports = userRoutes;