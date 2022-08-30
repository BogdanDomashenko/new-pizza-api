const {
	ProductModel,
	ProductImage,
	SizeModel,
	TypeModel,
} = require("../models/ProductModels");
const {
	OrderModel,
	OrderProductsModel,
	OrderShippingModel,
	UserModel,
} = require("../models/UserModels");

exports.OrderService = {
	async create(products, UserId, OrderShipping) {
		const order = await OrderModel.create(
			{ UserId, OrderShipping },
			{ include: { model: OrderShippingModel } }
		);

		let totalPrice = 0;
		let totalCount = 0;

		for (let product of products) {
			const { price: productPrice } = await ProductModel.findOne({
				where: { id: product.id },
			});
			totalPrice += productPrice * product.count;
			totalCount += product.count;

			await OrderProductsModel.create({
				count: product.count,
				totalPrice: productPrice * product.count,
				ProductId: product.id,
				OrderId: order.id,
				TypeId: product.TypeId,
				SizeId: product.SizeId,
			});
		}

		await order.update({ totalPrice, totalCount });
		await order.save();

		return order;
	},
	async get(id) {
		const order = await OrderModel.findOne({
			where: { id },
			include: {
				model: OrderProductsModel,
				attributes: ["count", "totalPrice"],
				include: [
					{
						model: ProductModel,
						include: [ProductImage],
					},
					TypeModel,
					SizeModel,
				],
			},
		});

		return order;
	},
	async getByUser(UserId, size, page) {
		const { count: totalCount, rows: orders } =
			await OrderModel.findAndCountAll({
				where: { UserId },
				limit: size,
				offset: size * page,
				order: [["createdAt", "DESC"]],
				attributes: ["id", "status", "createdAt", "totalPrice"],
				include: {
					model: OrderProductsModel,
					attributes: ["count", "totalPrice"],
					include: [
						{
							model: ProductModel,
							include: [ProductImage],
						},
						TypeModel,
						SizeModel,
					],
				},
			});

		return { list: orders, totalCount };
	},
	async getAll(size, page) {
		const { count: totalCount, rows: orders } =
			await OrderModel.findAndCountAll({
				limit: size,
				offset: size * page,
				order: [["createdAt", "DESC"]],
				attributes: ["id", "status", "createdAt", "totalPrice", "totalCount"],
				include: [
					{
						model: OrderProductsModel,
						attributes: ["count", "totalPrice"],
						include: [
							{
								model: ProductModel,
								include: [ProductImage],
							},
							TypeModel,
							SizeModel,
						],
					},
					{ model: UserModel, attributes: ["id", "phoneNumber"] },
					OrderShippingModel,
				],
			});

		return { list: orders, totalCount };
	},
};
