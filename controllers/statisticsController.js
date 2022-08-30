const { Sequelize } = require("../db");
const { ProductModel } = require("../models/ProductModels");
const { OrderProductsModel, OrderModel } = require("../models/UserModels");

exports.productPopularity = async (req, res, next) => {
	try {
		const products = await ProductModel.findAll({
			include: [{ model: OrderProductsModel }],
		});

		const mappedProducts = products.map((product) => ({
			id: product.id,
			name: product.name,
			sales: product.OrderProducts.length,
		}));

		res.send(mappedProducts);
	} catch (error) {
		next(error);
	}
};

exports.salesBy = async (req, res, next) => {
	try {
		const by = req.query.by;
		const num = Number.parseInt(req.query.num);

		const products = await ProductModel.findAll({
			include: [
				{
					model: OrderProductsModel,
					include: {
						model: OrderModel,
						attributes: ["createdAt"],
						where: Sequelize.where(
							Sequelize.fn(by, Sequelize.col("createdAt")),
							num
						),
					},
				},
			],
		});

		const mappedProducts = products.map((product) => ({
			id: product.id,
			name: product.name,
			sales: product.OrderProducts.length,
		}));

		res.send(mappedProducts);
	} catch (error) {
		next(error);
	}
};
