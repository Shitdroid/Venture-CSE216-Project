// libraries
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// my modules
const DB_auth = require("../../Database/DB_auth_api");
const authUtils = require("../../utils/auth_utils");
const auth = require("../../middlewares/auth");

// creating router
const router = express.Router({ mergeParams: true });

router.use(bodyParser.urlencoded({ extended: true }));

// ROUTE: login (post)
// Launches when submit button is pressed on form
router.post("/", async (req, res) => {
    // if not logged in take perform the post
    console.log(process.env.APP_SECRET);
    if (req.user == null) {
        let results,
            errors = [];
        // get login info for handle (id, handle, password)
        results = await DB_auth.getLoginInfoByEmail(req.body.Uemail);

        // if no result, there is no such user
        if (results.length == 0) {
            errors.push("No such user found");
        } else {
            // match passwords
            const match = await bcrypt.compare(
                req.body.Pass,
                results[0].PASSWORD
            );
            if (match) {
                // if successful login the user
                await authUtils.loginUser(res, results[0].USER_ID);
            } else {
                errors.push("wrong password");
            }
        }
        console.log(
            "Username is :" +
                req.body.Uemail +
                " and password is :" +
                req.body.Pass
        );
        // if any error, redirect to login page but with form information, else redirect to homepage
        if (errors.length == 0) {
            console.log("Login Completed");
            res.redirect("/");
        } else {
            res.render("landing.ejs", {
                error: errors,
            });
            // show login page
            // res.render('layout.ejs', {
            //     title : 'Login - Venture',
            //     body : ['login'],
            //     user : null,
            //     errors : errors,
            //     form: {
            //         email: req.body.email,
            //         password: req.body.password
            //     }
            // });
        }
    } else {
        console.log(req.user);
        res.redirect("/");
    }
});

module.exports = router;
