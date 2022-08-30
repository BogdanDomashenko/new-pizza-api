const express = require("express");
const {
	availableProducts,
	allStockPizzas,
	setPizzaAvailable,
	setPizzaNotAvailable,
	setPizzaSizeAvailable,
	setPizzaTypeAvailable,
} = require("../controllers/stockController");
const verifyRoles = require("../middleware/verifyRoles");
const { ROLES } = require("../utils/constants/userRolesConsts");
const router = express.Router();

router.get("/available", availableProducts);
router.get("/allPizzas", allStockPizzas);
router.get(
	"/setPizzaAvailable/:id",
	verifyRoles(ROLES.admin),
	setPizzaAvailable
);
router.get(
	"/setPizzaNotAvailable/:id",
	verifyRoles(ROLES.admin),
	setPizzaNotAvailable
);
router.post(
	"/setPizzaSizeAvailable",
	verifyRoles(ROLES.admin),
	setPizzaSizeAvailable
);
router.post(
	"/setPizzaTypeAvailable",
	verifyRoles(ROLES.admin),
	setPizzaTypeAvailable
);

module.exports = router;
