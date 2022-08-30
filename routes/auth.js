const express = require("express");
const { signIn, logout, signUp } = require("../controllers/authController");
const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp)
router.get("/logout", logout);

module.exports = router;
