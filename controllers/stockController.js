const ApiError = require("../error/ApiError");
const { ProductService } = require("../services/ProductService");

const {
	ProductModel,
	SizeModel,
	TypeModel,
	ProductImage,
	CategoryModel,
	ProductSizes,
	ProductTypes,
} = require("../models/ProductModels");

exports.availableProducts = async (req, res, next) => {
	try {
		const category = Number.parseInt(req.query.category);
		const page = Number.parseInt(req.query.page);
		const size = Number.parseInt(req.query.size);

		const where = category ? { categoryId: category } : null;

		const { count: totalCount, rows: list } =
			await ProductModel.findAndCountAll({
				limit: size,
				offset: size * page,
				distinct: true,
				attributes: ["id", "name", "price", "rating"],
				include: [
					{
						model: SizeModel,
						where: {},
						through: { attributes: [] },
					},
					{
						model: TypeModel,

						where: {},
						through: { attributes: [] },
					},
					{
						model: ProductImage,
						attributes: ["url"],
					},
					{
						model: CategoryModel,
					},
				],
				where,
			});

		const sizes = await ProductService.getProductSizes();
		const types = await ProductService.getProductTypes();

		return res.json({ list, totalCount, sizes, types });
	} catch (err) {
		return next(err);
	}
};

exports.allStockPizzas = async (req, res, next) => {
	const page = Number.parseInt(req.query.page);
	const size = Number.parseInt(req.query.size);

	try {
		const { count: totalCount, rows: list } =
			await ProductModel.findAndCountAll({
				limit: size,
				offset: size * page,
				attributes: ["id", "name"],
				order: [["id", "DESC"]],
				distinct: true,
				include: [
					{
						model: SizeModel,
						attributes: ["name"],
						through: { attributes: [] },
					},
					{
						model: TypeModel,
						attributes: ["name"],
						through: { attributes: [] },
					},
				],
			});

		return res.json({ list: list, totalCount });
	} catch (err) {
		return next(err);
	}
};

exports.setPizzaAvailable = async (req, res, next) => {
	try {
		const { id } = req.params;

		const sizes = await SizeModel.findAll({});
		const types = await TypeModel.findAll({});

		const productSizesArr = sizes
			.filter((size) => size.name !== "none")
			.map((size) => ({
				ProductId: id,
				SizeId: size.id,
			}));

		const productTypesArr = types
			.filter((size) => size.name !== "none")
			.map((type) => ({
				ProductId: id,
				TypeId: type.id,
			}));

		await ProductSizes.bulkCreate(productSizesArr);
		await ProductTypes.bulkCreate(productTypesArr);

		res.sendStatus(200);
	} catch (err) {
		return next(err);
	}
};

exports.setPizzaNotAvailable = async (req, res, next) => {
	try {
		const { id } = req.params;

		if (!id) return next(ApiError.badRequest("Request must have 'id' param"));

		await ProductSizes.destroy({ where: { ProductId: id } });
		await ProductTypes.destroy({ where: { ProductId: id } });

		res.sendStatus(200);
	} catch (err) {
		return next(err);
	}
};

exports.setPizzaSizeAvailable = async (req, res, next) => {
	try {
		const { id, SizeId, available } = req.body;

		if (!id || !SizeId)
			return next(
				ApiError.badRequest("Request body must have 'id' and 'SizeId' param")
			);

		if (available) {
			await ProductSizes.create({ ProductId: id, SizeId });
		} else {
			await ProductSizes.destroy({ where: { ProductId: id, SizeId } });
		}
		res.sendStatus(200);
	} catch (err) {
		return next(err);
	}
};

exports.setPizzaTypeAvailable = async (req, res, next) => {
	try {
		const { id, TypeId, available } = req.body;

		if (!id || !TypeId)
			return next(
				ApiError.badRequest("Request body must have 'id' and 'TypeId' param")
			);

		if (available) {
			await ProductTypes.create({ ProductId: id, TypeId });
		} else {
			await ProductTypes.destroy({ where: { ProductId: id, TypeId } });
		}

		res.sendStatus(200);
	} catch (err) {
		return next(err);
	}
};
