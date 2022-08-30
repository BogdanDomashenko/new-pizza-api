const ApiError = require("../error/ApiError");
const verifyRoles = (...allowedRoles) => {
	return (req, res, next) => {
		const allowed = allowedRoles.includes(res.locals.role);

		if (!allowed) return next(ApiError.forbidden());
		next();
	};
};

module.exports = verifyRoles;
