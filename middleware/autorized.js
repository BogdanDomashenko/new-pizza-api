const { ROLES } = require("../utils/constants/userRolesConsts");
const ApiError = require("../error/ApiError");

const autorized = (req, res, next) => {
	const { role } = res.locals;

	if (!role || role === ROLES.phantom) {
		return next(ApiError.forbidden());
	}

	return next();
};

module.exports = autorized;
