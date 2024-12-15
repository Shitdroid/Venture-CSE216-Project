const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const router = express.Router({ mergeParams: true });

const db_job_api = require("../../Database/DB_job_api");

const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: "Public/JobImage",
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

router.get("/:id", async (req, res) => {
    if (req.user != null) {
        let service = await db_job_api.getJobById(req.params.id).rows;
        if (service[0] != null) {
            res.render("service.ejs", {
                service: service,
            });
        } else {
            res.redirect("/");
        }
    }
});

router.get("/:id/delete", async (req, res) => {
    if (req.user != null) {
        return await db_service_api.deleteJob(req.params.id);
    } else res.redirect("/");
});

router.post("create", upload.single("picture"), async (req, res) => {
    // check if already logged in
    console.log("asf");
    if (req.user.USER_TYPE == "buyer") {
        let results,
            errors = [];
        if (req.error != null) errors.push(req.error);
        else {
            if (req.file != null) filename = "ServiceImage" + req.file.filename;
            else filename = null;
        }
        req.error = null;
        let service = {
            price: req.body.price,
            description: req.body.description,
            picture: filename,
            days_taken: req.body.days_taken,
            title: req.body.title,
            id: req.user.ID,
            tags: req.body.tags,
        };
        results = await db_job_api.createJob(service);
        let redirection = "/job/" + results;
        res.redirect(redirection);
        // check if email is already used or not
    }
});

module.exports = router;
