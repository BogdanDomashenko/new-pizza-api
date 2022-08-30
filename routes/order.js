const express = require("express");
const {
	checkoutOrder,
	getOrder,
	updateOrder,
	orderList,
	userOrderList,
	phantomCheckoutOrder,
	shippingOrderData,
	deliveryPrice,
	setDeliveryPrice,
} = require("../controllers/orderController");
const verifyRoles = require("../middleware/verifyRoles");
const { ROLES } = require("../utils/constants/userRolesConsts");
const autorized = require("../middleware/autorized");
const router = express.Router();

router.get("/info/:id", getOrder);
router.post("/checkout", verifyRoles(ROLES.admin), checkoutOrder);
router.post("/phantom-checkout", phantomCheckoutOrder);
router.post("/update", verifyRoles(ROLES.admin), updateOrder);
router.get("/list", verifyRoles(ROLES.admin), orderList);
router.get("/list-by-user", autorized, userOrderList);
router.get("/shipping-data/:id", verifyRoles(ROLES.admin), shippingOrderData);
router.get("/delivery-price", deliveryPrice);
router.post("/set-delivery-price", verifyRoles(ROLES.admin), setDeliveryPrice);

module.exports = router;
