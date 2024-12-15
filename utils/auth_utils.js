// libraries
const jwt = require("jsonwebtoken");

// my modules
const DB_auth = require("../Database/DB_auth_api");

// function to login user into a session
async function loginUser(res, userId) {
    // create token
    console.log(userId);
    const payload = {
        id: userId,
    };
    let token = jwt.sign(payload, process.env.APP_SECRET);
    // put token in db
    //await DB_auth.updateUserTokenById(userId, token);
    // set token in cookie
    let options = {
        maxAge: 90000000,
        httpOnly: true,
    };
    console.log(token);
    res.cookie("id", token, options);
}

//add two numbers

module.exports = {
    loginUser,
};
