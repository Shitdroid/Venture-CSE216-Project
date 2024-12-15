// libraries
const express = require("express");

const router = express.Router({ mergeParams: true });
const DB_stats = require("../Database/DB_employer_site_stats_api");

// sub-routers
const searchRouter = require("./search");
const signupRouter = require("./auth/signup");
const loginRouter = require("./auth/login");
const logoutRouter = require("./auth/logout");
const freelancerRouter = require("./Freelancer/freelancer");
const employerRouter = require("./Employer/employer");
const jobRouter= require(./Job/job);

// const profileRouter = require("./My-Section/profile");

router.get("/", async (req, res) => {
    console.log(req.user);
    // if (req.user == null) return res.redirect("/login");
    if (req.user == null) return res.render("landing.ejs");
    if (req.user.USER_TYPE == "buyer") {
        res.redirect("/employer");
    } else res.redirect("/freelancer");

    //show landing page
    // res.render("layout.ejs", {
    //     user: req.user,
    //     body: ["landingPage"],
    //     title: "Venture",

    //     highestRatedServices: highestRatedServices,
    //     mostSoldServices: mostSoldServices,
    //     recentlySoldServices: recentlySoldServices,
    // });
});

// setting up sub-routers

router.use("/signup", signupRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/freelancer", freelancerRouter);
router.use("/search", searchRouter);
router.use("/employer", employerRouter);
router.use("/job",jobRouter);
module.exports = router;
