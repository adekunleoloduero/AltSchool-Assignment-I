
const { returnAllRecords} = require('./utils');



// const usersDbPath = getPath(__dirname, [''], ['models', 'users.json']); //For Production//Production usersDB path
// const usersDbPath = getPath(__dirname, ['src'], ['test', 'fixtures', 'stubs', 'users.json']); //For testing purpose


async function inputValidation(req, res, usersDbPath) {
    const loginDetails = req.body;
    if ((loginDetails.username === undefined && loginDetails.email === undefined) && loginDetails.password === undefined) {
        req.ERROR_CODE = 400;
        req.ERROR_MESSAGE = {message: 'Please, enter your login details.'}
        return;
    }
    const users = await returnAllRecords(usersDbPath);
    const usersArray = JSON.parse(users);
    const userFound = usersArray.find(user => {
        if (user.username === loginDetails.username || user.email === loginDetails.email) {
            return user;
        }
    });

    if (!userFound) {
        req.ERROR_CODE = 400;
        req.ERROR_MESSAGE = {message: 'Invalid username or email.'};
        return;
    }

    if (userFound.password !== loginDetails.password) {
        req.ERROR_CODE = 400;
        req.ERROR_MESSAGE = {message: 'Wrong password for user.'};
        return;
    } else {
        req.USER_ROLE = userFound.role;
        return true;
    }
}


async function auth(req, res, roles) {
    if (roles.includes(req.USER_ROLE)) {
        return true;
    } else {
        req.ERROR_CODE = 401;
        req.ERROR_MESSAGE = { message: 'Access denied. Only admin users are permitted.' };
        return;
    } 
} 




module.exports = {
    inputValidation,
    auth,
}