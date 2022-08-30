const bcrypt = require("bcrypt");

const ApiError = require("../error/ApiError");
const { UserModel } = require("../models/UserModels");
const { ROLES } = require("../utils/constants/userRolesConsts");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../utils/helpers/token");

exports.signUp = async (req, res, next) => {
	try {
		const { phoneNumber, password } = req.body;

		const hashedPassword = await bcrypt.hash(password, 3);

		const User = await UserModel.findOne({ where: { phoneNumber } });
		const isSignUpped = !!(User && User.password?.length);

		if (isSignUpped) {
			return next(ApiError.badRequest("This user is already registered"));
		}

		if (User && !isSignUpped) {
			const newUser = await User.update({
				password: hashedPassword,
				role: ROLES.user,
			});

			return res.json({
				id: newUser.id,
				phoneNumber: newUser.phoneNumber,
				role: newUser.role,
			});
		}

		const newUser = await UserModel.create({
			phoneNumber,
			password: hashedPassword,
		});

		const data = {
			id: newUser.id,
			phoneNumber: newUser.phoneNumber,
			role: newUser.role,
		};

		const accessToken = generateAccessToken(data);
		const refreshToken = generateRefreshToken(data);

		res.cookie("refreshToken", refreshToken, {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		res.set("Authorization", accessToken);
		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
};

exports.signIn = async (req, res, next) => {
	try {
		const { phoneNumber, password } = req.body;

		const User = await UserModel.findOne({ where: { phoneNumber } });

		if (!User) {
			return next(ApiError.badRequest("This user does not exists"));
		}

		const isPassEquals = await bcrypt.compare(password, User.password);

		if (!isPassEquals) {
			return next(ApiError.badRequest("Incorrect password"));
		}

		const data = {
			id: User.id,
			phoneNumber: User.phoneNumber,
			role: User.role,
		};

		const accessToken = generateAccessToken(data);
		const refreshToken = generateRefreshToken(data);

		res.cookie("refreshToken", refreshToken, {
			maxAge: 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		res.set("Authorization", accessToken);
		res.status(200).json(data);
	} catch (error) {
		next(error);
	}
};

exports.logout = (req, res) => {
	try {
		res.clearCookie("refreshToken");
		res.sendStatus(200);
	} catch (e) {
		next(ApiError.badRequest("Logout error"));
	}
};
