// libraries
const express = require("express");

const router = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");
const DB_stats1 = require("../Database/DB_employer_site_stats_api");

const DB_stats2 = require("../Database/DB_freelancer_site_stats_api");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.post("/", (req, res) => {
    let a = [];
    if (req.user.USER_TYPE == "buyer") {
        a = DB_stats1.getUnfilteredSearchItems(req.body.searchkey, 0, 30);
        res.render("workpage.ejs", {
            id: req.user.id,
            type: "employer",
            choices: a,
        });
    } else if (req.user.USER_TYPE == "seller") {
        a = DB_stats2.getUnfilteredSearchItems(req.body.searchkey, 0, 30);
        res.render("searchpage.ejs", {
            id: req.user.id,
            type: "freelancer",
            choices: a,
        });
    }
});

module.exports = router;
