const express = require("express");
const { accessToken, refreshToken } = require("../controllers/tokenController");
const router = express.Router();

router.post("/access", accessToken);
router.get("/refresh", refreshToken);

module.exports = router;
