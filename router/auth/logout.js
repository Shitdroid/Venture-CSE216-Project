// libraries
const express = require("express");
const DB_auth = require("../../Database/DB_auth_api");

// creating router
const router = express.Router({ mergeParams: true });

router.all("/", async (req, res) => {
    // if logged in, delete token from database
    req.user = null;
    res.clearCookie("id");
    res.redirect("/");
});

module.exports = router;
