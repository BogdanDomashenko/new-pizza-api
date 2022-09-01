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
			let additionalPrice = 0;

			const {
				price: productPrice,
				Types,
				Sizes,
			} = await ProductModel.findOne({
				where: { id: product.id },
				include: [TypeModel, SizeModel],
			});

			const typePrice =
				Types.find((type) => type.id === product.TypeId).price || 0;
			const sizePrice =
				Sizes.find((size) => size.id === product.SizeId).price || 0;

			additionalPrice = typePrice + sizePrice;

			totalPrice += (productPrice + additionalPrice) * product.count;
			totalCount += product.count;

			await OrderProductsModel.create({
				count: product.count,
				totalPrice: (productPrice + additionalPrice) * product.count,
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
