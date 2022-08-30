const { SizeModel, TypeModel } = require("../models/ProductModels");
const { parseOrderProps } = require("../utils/helpers/order");

exports.ProductService = {
	async getProductSizes() {
		const sizes = await SizeModel.findAll();
		return sizes;
	},
	async getProductTypes() {
		const types = await TypeModel.findAll();
		return types;
	},
	async getProductSize(id) {
		const size = await SizeModel.findAll({ where: { id } });
		return size;
	},
	async getProductType(id) {
		const type = await TypeModel.findAll({ where: { id } });
		return type;
	},
	async getAdditionalPriceByProps(props) {
		const parsedProps = parseOrderProps(props);

		const type = await TypeModel.findOne({
			where: { name: parsedProps.type },
		});
		const size = await SizeModel.findOne({
			where: { name: parsedProps.size },
		});
		return type.price + size.price;
	},
	async createOrder(userID, orderList) {
		const UserOrder = await UserOrdersModel.create({ userID });
		for (let order of orderList) {
			const additionalPrice = await this.getAdditionalPriceByProps(order.props);
			const Pizza = await PizzasModel.findOne({ where: { id: order.pizzaID } });
			const totalPrice = order.count * (Pizza.price + additionalPrice);
			const newOrder = await PizzaOrdersModel.create({
				orderID: UserOrder.id,
				...order,
				totalPrice,
			});
		}

		console.log(await PizzaOrdersModel.findAll({ where: { orderID: 99 } }));

		return UserOrder;
	},
};
