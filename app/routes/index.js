const express = require("express");
const router = express.Router();

const backEnd = require("app/routes/backend");
const front = require("app/routes/frontend");


router.use("/", front);
router.use("/api", backEnd);

module.exports = router;
