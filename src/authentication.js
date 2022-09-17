
const { returnAllRecords} = require('./utilities');



// const usersDbPath = getPath(__dirname, [''], ['models', 'users.json']); //For Production//Production usersDB path
// const usersDbPath = getPath(__dirname, ['src'], ['test', 'fixtures', 'stubs', 'users.json']); //For testing purpose


async function passwordAuthentication(req, res, usersDbPath) {
    const loginDetails = req.body;
    if (loginDetails.username === undefined || loginDetails.password === undefined) {
        req.errorCode = 400;
        req.errorMessage = {message: 'Username or password is missing.'}
        return;
    }
    const users = await returnAllRecords(usersDbPath);
    const usersArray = JSON.parse(users);
    const userFound = usersArray.find(user => user.username === loginDetails.username);
    if (!userFound) {
        req.errorCode = 400;
        req.errorMessage = {message: 'Username not found, please register.'};
        return;
    }

    if (userFound.password !== loginDetails.password) {
        req.errorCode = 400;
        req.errorMessage = {message: 'Wrong username or password.'};
        return;
    } else {
        req.userRole = userFound.role;
        return true;
    }
}


async function adminAuthorization(req, res, roles, usersDbPath) {
    if (roles.includes(req.userRole)) {
        return true;
    } else {
        req.errorCode = 401;
        req.errorMessage = { message: 'Access denied. Only admin users are permitted.' };
        return;
    } 
} 




module.exports = {
    passwordAuthentication,
    adminAuthorization,
}