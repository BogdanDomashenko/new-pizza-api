const express = require("express");
const { categoryList } = require("../controllers/categoryController");
const router = express.Router();

router.get("/list", categoryList);

module.exports = router;
