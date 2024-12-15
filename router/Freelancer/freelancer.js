// libraries
const express = require("express");
const bodyParser = require("body-parser");
const DB_freelancer_api = require("../../Database/DB_freelancer_site_stats_api");
const DB_profile_api = require("../../Database/DB_profile_api");
const multer = require("multer");
const router = express.Router({ mergeParams: true });

router.use(bodyParser.urlencoded({ extended: true }));

const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: "Public/UserImage",
    filename: (req, file, cb) => {
        cb(null, req.user.IMAGE);
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

router.get("/", async (req, res) => {
    if (req.user.USER_TYPE === "seller") {
        const taken_jobs = await DB_freelancer_api.getTakenJobs(req.user.id);
        const preferred_jobs = DB_freelancer_api.getMostPreferredJobs(
            req.user.id
        );
        const created_services = DB_freelancer_api.getCreatedServices(
            req.user.id
        );
        const type = "freelancer";
        res.render("sellerpage.ejs", {
            id: req.user.id,
            rpic: req.user.IMAGE,
            fname: req.user.FIRST_NAME,
            lname: req.user.LAST_NAME,
            rmail: req.user.EMAIL_ID,
            rnum: req.user.PHONE,
            choices: preferred_jobs,
            taken_jobs: taken_jobs,
            created_services: created_services,
            type: type,
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
    const result = await DB_profile_api.getFreelancer(req.params.id);
    if (req.user.USER_TYPE === "seller") {
        res.render("profile.ejs", {
            id: req.user.id,
            deferred_id: req.params.id,
            rpic: req.user.IMAGE,
            fname: req.user.FIRST_NAME,
            lname: req.user.LAST_NAME,
            rmail: req.user.EMAIL_ID,
            rnum: req.user.PHONE,
            dob: result[0].DOB,
            bio: result[0].BIO,
        });
    } else res.redirect("/");
});

router.post("/:id/update", upload.single(), async (req, res) => {
    if (req.user.USER_TYPE === "seller" && req.params.id === req.user.id) {
        let employer = {
            id: req.params.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email_id: req.body.Remail,
            phone: req.body.Rnum,
            dob: req.body.DOB,
            bio: req.body.bio,
        };
        await DB_profile_api.updateFreelancer(req.params.id, employer);
        res.redirect("/profile/" + req.params.id);
    } else res.redirect("/");
});
module.exports = router;
