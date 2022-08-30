const { CallBackModel, UserModel } = require("../models/UserModels");
const { ROLES } = require("../utils/constants/userRolesConsts");

exports.addCallBack = async (req, res, next) => {
	try {
		const { phoneNumber } = req.body;

		let User = await UserModel.findOrCreate({
			where: { phoneNumber },
			defaults: { phoneNumber },
		});

		await CallBackModel.findOrCreate({
			where: { UserId: User[0].id },
			defaults: { UserId: User[0].id },
		});

		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

exports.callBacksList = async (req, res, next) => {
	try {
		const list = await CallBackModel.findAll({
			include: { model: UserModel, attributes: ["phoneNumber"] },
		});

		return res.json(list);
	} catch (err) {
		next(err);
	}
};

exports.deleteCallBack = async (req, res, next) => {
	try {
		const { id } = req.params;

		await CallBackModel.destroy({ where: { id } });

		res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};
