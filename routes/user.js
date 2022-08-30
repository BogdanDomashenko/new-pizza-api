const express = require("express");
const router = express.Router();
const { userList, setUserRole, userData } = require("../controllers/userController");
const verifyRoles = require("../middleware/verifyRoles");
const autorized = require("../middleware/autorized");
const { ROLES } = require("../utils/constants/userRolesConsts");

router.get("/list", verifyRoles(ROLES.admin), userList);
router.post("/set-role", verifyRoles(ROLES.admin), setUserRole);
router.get("/data", autorized, userData);

module.exports = router;
