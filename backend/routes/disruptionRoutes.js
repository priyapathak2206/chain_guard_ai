const express = require("express");

const {
    getDisruptions,
    getDisruptionById
} = require("../controllers/disruptionController");

const router = express.Router();

router.get("/", getDisruptions);

router.get("/:id", getDisruptionById);

module.exports = router;