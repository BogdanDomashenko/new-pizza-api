const express = require("express");
const {
	productPopularity,
	salesBy,
} = require("../controllers/statisticsController");
const verifyRoles = require("../middleware/verifyRoles");
const { ROLES } = require("../utils/constants/userRolesConsts");
const router = express.Router();

router.get("/product-sales", verifyRoles(ROLES.admin), productPopularity);
router.get("/sales-by", verifyRoles(ROLES.admin), salesBy);

module.exports = router;
