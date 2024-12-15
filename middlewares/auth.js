// libraries
const jwt = require("jsonwebtoken");

// my modules
const DB_auth = require("../Database/DB_auth_api");

function auth(req, res, next) {
    req.user = null;
    console.log("in auth" + " " + req.cookies.id);
    // check if user has cookie token
    if (req.cookies.id) {
        console.log("cookie found");
        let token = req.cookies.id;
        // verify token was made by server
        jwt.verify(token, process.env.APP_SECRET, async (err, decoded) => {
            if (err) {
                console.log("ERROR at verifying token: " + err.message);
                next();
            } else {
                // get user prompt (id, handle, message count) from id
                const decodedId = decoded.id;
                console.log("decoded=" + decoded.id);
                let results = await DB_auth.getLoginInfoByID(decodedId);
                console.log("results=" + results);
                // if no such user or token doesn't match, do nothing
                if (results == null || results.length == 0) {
                    console.log("auth: invalid cookie");
                } /* else if(results[0].LOGIN_TOKEN != token){
                    //console.log('auth: invalid token');
                } */ else {
                    req.user = {
                        id: decodedId,
                        EMAIL: results[0].EMAIL_ID,
                        FIRST_NAME: results[0].FIRST_NAME,
                        LAST_NAME: results[0].LAST_NAME,
                        IMAGE: results[0].PICTURE,
                        USER_TYPE: results[0].TYPE,
                        PHONE: results[0].PHONE,
                    };
                }
                next();
            }
        });
    } else {
        next();
    }
}

module.exports = {
    auth,
};
