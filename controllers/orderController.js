const ApiError = require("../error/ApiError");
const {
	UserModel,
	OrderModel,
	OrderShippingModel,
} = require("../models/UserModels");
const { ROLES } = require("../utils/constants/userRolesConsts");
const { OrderService } = require("../services/OrderService");
const { ProductService } = require("../services/ProductService");
const { DeliveryService } = require("../services/DeliveryService");

exports.getOrder = async (req, res, next) => {
	try {
		const { id } = req.params;

		const order = await OrderService.get(id);

		if (!order) {
			next(ApiError.badRequest("This order is does not exists"));
		}

		return res.json(order);
	} catch (err) {
		next(err);
	}
};

exports.checkoutOrder = async (req, res, next) => {
	try {
		const { orderList, shippingData } = req.body;

		const { id: userId } = res.locals;

		if (!orderList || !orderList.length) {
			return next(ApiError.badRequest("'orderList' param cannot be empty"));
		}

		const order = await OrderService.create(orderList, userId, shippingData);

		res.json({ id: order.id });
	} catch (err) {
		next(err);
	}
};

exports.phantomCheckoutOrder = async (req, res, next) => {
	try {
		const { orderList, shippingData } = req.body;

		let user = await UserModel.findOne({
			where: { phoneNumber: shippingData.phone },
		});

		if (user && user.role !== ROLES.phantom) {
			return next(
				ApiError.badRequest(
					"User with this phone number already exists, please sign in"
				)
			);
		}

		if (!user) {
			user = await UserModel.create({
				phoneNumber: shippingData.phone,
				role: ROLES.phantom,
			});
		}

		if (!orderList || !orderList.length) {
			return next(ApiError.badRequest("'orderList' param cannot be empty"));
		}

		const order = await OrderService.create(orderList, user.id, shippingData);

		res.json({ id: order.id });
	} catch (err) {
		next(err);
	}
};

exports.userOrderList = async (req, res, next) => {
	try {
		const id = res.locals.id;
		const page = Number.parseInt(req.query.page);
		const size = Number.parseInt(req.query.size);

		const orders = await OrderService.getByUser(id, size, page);

		res.json(orders);
	} catch (error) {
		next(error);
	}
};

exports.orderList = async (req, res, next) => {
	try {
		const page = Number.parseInt(req.query.page);
		const size = Number.parseInt(req.query.size);

		const orders = await OrderService.getAll(size, page);

		res.json(orders);
	} catch (error) {
		next(error);
	}
};

exports.updateOrder = async (req, res, next) => {
	try {
		const { order } = req.body;

		if (!order) {
			next(ApiError.badRequest("'order' param cannot be empty"));
		}

		await OrderModel.update({ ...order }, { where: { id: order.id } });

		res.sendStatus(201);
	} catch (err) {
		next(err);
	}
};

exports.shippingOrderData = async (req, res, next) => {
	try {
		const { id } = req.params;

		const shippingData = await OrderShippingModel.findOne({
			where: { userOrderID: id },
		});

		res.json(shippingData);
	} catch (error) {
		next(error);
	}
};

exports.deliveryPrice = async (req, res, next) => {
	try {
		const price = await DeliveryService.getPrice();

		res.json({ price });
	} catch (error) {
		next(error);
	}
};

exports.setDeliveryPrice = async (req, res, next) => {
	try {
		const { price } = req.body;
		await DeliveryService.setPrice(price);

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
};
