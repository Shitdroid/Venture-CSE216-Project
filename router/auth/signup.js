// libraries
const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
// my modules
const DB_auth = require("../../Database/DB_auth_api");
// const DB_cart = require("../../Database/DB_cart_api");
const authUtils = require("../../utils/auth_utils");

// creating router
const router = express.Router({ mergeParams: true });

const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: "Public/UserImage",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

const upload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 100000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|gif)$/)) {
            // upload only png, gif and jpg format
            req.error = "Please upload image file (png, jpg, gif)";
            return cb(
                null,
                false
                // ,new Error("Please upload image file (png, jpg, gif)")
            );
        }
        cb(undefined, true);
    },
});

router.get("/", (req, res) => {
    // check if already logged in
    console.log(req.user);
    if (req.user == null) {
        res.render("registration.ejs", {
            errors: [],
        });
    } else {
        res.redirect("/");
    }
});

router.post("/", upload.single("picture"), async (req, res) => {
    // check if already logged in
    if (req.user == null) {
        let results,
            errors = [];
        if (req.error != null) errors.push(req.error);
        else {
            if (req.file != null) filename = "UserImage" + req.file.filename;
            else filename = null;
        }
        req.error = null;
        // check if email is already used or not
        console.log(req.body);
        results = await DB_auth.getUserIDByEmail(req.body.email);
        if (results.length > 0)
            errors.push("Email is already registered to a user");

        // check if password confirmation is right
        // if (req.body.password !== req.body.password2)
        //     errors.push("Password confirmation doesn't match with password");

        // check if password has at least 6 char
        // if (req.body.password.length < 8) {
        //     errors.push("Password must be at least 8 characters");
        // }

        // if there are errors, redirect to sign up but with form informations
        if (errors.length > 0) {
            console.log(errors);
            //show signup page again
            res.render("registration.ejs", {
                errors: errors,
                // form: {
                //     name: req.body.name,
                //     email: req.body.email,
                //     password: req.body.password,
                //     password2: req.body.password2,
                // },
            });
        } else {
            // if no error, create user object to be sent to database api
            let user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: req.body.Rpass,
                email: req.body.Remail,
                phone: req.body.Rnum,
                type: req.body.user_class,
                picture: filename,
                DOB: req.body.DOB,
                bio: req.body.bio,
            };
            // hash user password
            await bcrypt.hash(user.password, 8, async (err, hash) => {
                if (err)
                    console.log("ERROR at hashing password: " + err.message);
                else {
                    // create user via db-api, id is returned
                    user.password = hash;
                    let result = await DB_auth.createNewUser(user);
                    // let result2 = await DB_auth.getLoginInfoByEmail(user.email);

                    // login the user too
                    await authUtils.loginUser(res, result[0].ID);
                    // redirect to home page
                    //res.redirect(`/profile/${user.handle}/settings`);
                    res.redirect("/");
                }
            });
        }
    } else {
        res.redirect("/");
    }
});

module.exports = router;
