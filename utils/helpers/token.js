const jwt = require("jsonwebtoken");

//change to 20m
exports.generateAccessToken = (obj) => {
	return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
	//return jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
};

exports.generateRefreshToken = (obj) => {
	return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
	//return jwt.sign(obj, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "5s" });
};
