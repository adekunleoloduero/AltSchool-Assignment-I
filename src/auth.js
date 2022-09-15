// const { resource } = require('./app');
const { returnAllRecords, getPath } = require('./utilities');



// const usersDbPath = getPath(__dirname, [''], ['models', 'users.json']); //For Production//Production usersDB path
const usersDbPath = getPath(__dirname, ['src'], ['test', 'fixtures', 'stubs', 'users.json']); //For testing purpose


async function auth(req, res, roles, next) {
    const loginDetails = req.body;
    let message;
    let authorized = false;
    if (!loginDetails) {
        message = 'Username or password is missing.'
    }
    const users = await returnAllRecords(usersDbPath);
    const usersArray = JSON.parse(users);
    const userFound = usersArray.find(user => user.username === loginDetails.username);
    if (!userFound) {
        message = 'Username not found, please register.'
    }

    if (userFound.password !== loginDetails.password) {
        message = 'Wrong username or password.'
    }
    
    if (roles.includes(userFound.role)) {
        authorized = true;
        next(authorized);
    }
    
}




module.exports = {
    auth,
}