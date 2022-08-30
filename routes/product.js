const express = require("express");
const {
	prodcutList,
	productUpdate,
	productSizes,
	productTypes,
	addProduct,
	deleteProduct,
	updateType,
	updateSize,
	addSize,
	addType,
	deleteSize,
	deleteType,
} = require("../controllers/productController");
const verifyRoles = require("../middleware/verifyRoles");
const { ROLES } = require("../utils/constants/userRolesConsts");
const router = express.Router();

router.post("/update", verifyRoles(ROLES.admin), productUpdate);
router.get("/sizes", productSizes);
router.get("/types", productTypes);
router.post("/add", verifyRoles(ROLES.admin), addProduct);
router.get("/delete/:id", verifyRoles(ROLES.admin), deleteProduct);
router.get("/list", prodcutList);
router.post("/update-type", verifyRoles(ROLES.admin), updateType);
router.post("/update-size", verifyRoles(ROLES.admin), updateSize);
router.post("/add-size", verifyRoles(ROLES.admin), addSize);
router.post("/add-type", verifyRoles(ROLES.admin), addType);
router.post("/delete-size", verifyRoles(ROLES.admin), deleteSize);
router.post("/delete-type", verifyRoles(ROLES.admin), deleteType);

module.exports = router;
