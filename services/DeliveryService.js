const { DeliveryModel } = require("../models/UserModels");

exports.DeliveryService = {
	async getPrice() {
		const delivery = await DeliveryModel.findOne({ where: { id: 1 } });

		return delivery.price;
	},
	async setPrice(price) {
		return await DeliveryModel.update({ price }, { where: { id: 1 } });
	},
};
