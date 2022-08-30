const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const { UserModel } = require("../models/UserModels");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../utils/helpers/token");

exports.accessToken = (req, res, next) => {
	try {
		const { authorization } = req.headers;

		if (authorization) {
			jwt.verify(
				authorization,
				process.env.ACCESS_TOKEN_SECRET,
				(err, user) => {
					if (err) {
						return next(ApiError.badRequest("Access token not valid"));
					}
					return res.send(req.session.refreshToken);
				}
			);
		} else {
			next(ApiError.badRequest("token does not exist"));
		}
	} catch (e) {
		next(ApiError.badRequest("Access token error"));
	}
};

exports.refreshToken = (req, res, next) => {
	try {
		if (req.cookies.refreshToken) {
			jwt.verify(
				req.cookies.refreshToken || " ",
				process.env.REFRESH_TOKEN_SECRET,
				async (err, user) => {
					if (err) return next(ApiError.unauthorized());

					const { id, phoneNumber, role } = await UserModel.findOne({
						where: { id: user.id },
					});
					const data = { id, phoneNumber, role };

					const accessToken = generateAccessToken(data);
					const refreshToken = generateRefreshToken(data);

					res.cookie("refreshToken", refreshToken, {
						maxAge: 24 * 60 * 60 * 1000,
						httpOnly: true,
					});
					res.set("Authorization", accessToken);
					res.sendStatus(201);
				}
			);
		} else {
			next(ApiError.unauthorized("token does not exist"));
		}
	} catch (e) {
		next(ApiError.unauthorized("Token refresh error"));
	}
};
