const express = require("express");
const db_employer_api = require("../../Database/DB_employer_site_stats_api");
const db_tag_api = require("../../Database/DB_tag_api");
const DB_profile_api = require("../../Database/DB_profile_api");
const router = express.Router({ mergeParams: true });
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.get("/", async (req, res) => {
    if (req.user.USER_TYPE === "buyer") {
        let created_jobs = await db_employer_api.getCreatedJobs(req.user.id);
        let recent_buy = await db_employer_api.getRecentlySoldServices();
        let highest_rated = await db_employer_api.getHighestRatedServices();
        let most_preferred = await db_employer_api.getMostPreferredServices(
            req.user.id
        );
        let tags = await db_tag_api.getAllTags();
        let bought_services = await db_employer_api.getBoughtServices(
            req.user.id
        );
        req.user.phone = "01706641482";
        let most_sold = await db_employer_api.getMostSoldServicesOfLastMonth();
        console.log("tags:" + tags[0]);
        const type = "employer";
        res.render("buyerpage.ejs", {
            rpic: req.user.IMAGE,
            fname: req.user.FIRST_NAME,
            lname: req.user.LAST_NAME,
            rmail: req.user.EMAIL_ID,
            rnum: req.user.PHONE,
            created_jobs: created_jobs,
            recent_buys: recent_buy,
            choices: most_preferred,
            most_sold: most_sold,
            best: highest_rated,
            bought_services: bought_services,
            tags: tags,
            type: type,
            id: req.user.id,
        });
    } else res.redirect("/");
});

router.get("/:id/delete", async (req, res) => {
    await DB_profile_api.deleteUser(req.params.id);
    req.user = null;
    res.clearCookie("sessionToken");
    res.redirect("/");
});

router.get("/:id", async (req, res) => {
    const result = await DB_profile_api.getEmployer(req.params.id);
    if (req.user.USER_TYPE != null) {
        res.render("buyerProfile.ejs", {
            id: req.user.id,
            deferred_id: req.params.id,
            rpic: req.user.IMAGE,
            fname: req.user.FIRST_NAME,
            lname: req.user.LAST_NAME,
            rmail: req.user.EMAIL_ID,
            rnum: req.user.PHONE,
            dob: result[0].DOB,
            type: req.user.USER_TYPE,
        });
    } else res.redirect("/");
});

router.post("/:id/update", async (req, res) => {
    if (req.user.USER_TYPE == "buyer" && req.params.id == req.user.id) {
        let employer = {
            id: req.params.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email_id: req.body.Remail,
            phone: req.body.Rnum,
            dob: req.body.DOB,
        };
        await DB_profile_api.updateEmployer(req.params.id, employer);
        res.redirect("/profile/" + req.params.id);
    } else res.redirect("/");
});

module.exports = router;
