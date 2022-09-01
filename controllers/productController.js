const { elasticClient } = require("../db/elastic");
const ApiError = require("../error/ApiError");
const {
	ProductModel,
	ProductImage,
	TypeModel,
	SizeModel,
	ProductTypes,
	ProductSizes,
} = require("../models/ProductModels");
const { OrderProductsModel } = require("../models/UserModels");
const { ProductService } = require("../services/ProductService");

exports.prodcutList = async (req, res, next) => {
	try {
		const page = Number.parseInt(req.query.page);
		const size = Number.parseInt(req.query.size);
		const { count: totalCount, rows: list } =
			await ProductModel.findAndCountAll({
				limit: size,
				offset: size * page,
				order: [["id", "DESC"]],
				include: [ProductImage],
			});

		return res.json({ list, totalCount });
	} catch (err) {
		return next(err);
	}
};

exports.productUpdate = async (req, res, next) => {
	try {
		const { pizza } = req.body;

		console.log(pizza);

		const product = await ProductModel.update(pizza, {
			where: { id: pizza.id },
			include: ProductImage,
		});

		await ProductImage.destroy({ where: { ProductId: pizza.id } });

		for (image of pizza.ProductImages) {
			await ProductImage.create({ url: image.url, ProductId: pizza.id });
		}

		console.log(product);
		return res.sendStatus(201);
	} catch (err) {
		return next(err);
	}
};

exports.productSizes = async (req, res, next) => {
	try {
		const sizes = await ProductService.getProductSizes();

		return res.json(sizes);
	} catch (err) {
		next(err);
	}
};

exports.productTypes = async (req, res, next) => {
	try {
		const types = await ProductService.getProductTypes();

		return res.json(types);
	} catch (err) {
		next(err);
	}
};

exports.addProduct = async (req, res, next) => {
	try {
		const {
			name,
			ProductImages,
			price,
			category: categoryId,
			rating,
		} = req.body;

		const newProduct = await ProductModel.create(
			{
				name,
				ProductImages,
				price,
				categoryId,
				rating,
			},
			{ include: ProductImage }
		);

		return res.json(newProduct);
	} catch (err) {
		next(err);
	}
};

exports.deleteProduct = async (req, res, next) => {
	try {
		const { id } = req.params;

		await ProductImage.destroy({ where: { ProductId: id } });
		await ProductModel.destroy({ where: { id } });

		return res.sendStatus(200);
	} catch (err) {
		next(err);
	}
};

exports.updateType = async (req, res, next) => {
	try {
		const { id, name, price } = req.body;

		await TypeModel.update({ id, name, price }, { where: { id } });

		return res.sendStatus(200);
	} catch (err) {
		return next(err);
	}
};

exports.updateSize = async (req, res, next) => {
	try {
		const { id, name, price } = req.body;

		await SizeModel.update({ name, price }, { where: { id } });

		return res.sendStatus(200);
	} catch (err) {
		return next(err);
	}
};

exports.addType = async (req, res, next) => {
	try {
		const { name, price } = req.body;

		const newType = await TypeModel.create({ name, price });

		res.json(newType);
	} catch (err) {
		return next(err);
	}
};

exports.addSize = async (req, res, next) => {
	try {
		const { name, price } = req.body;

		const newSize = await SizeModel.create({ name, price });

		res.json(newSize);
	} catch (err) {
		return next(err);
	}
};

exports.deleteSize = async (req, res, next) => {
	try {
		const { id } = req.body;

		await ProductSizes.destroy({ where: { SizeId: id } });
		await SizeModel.destroy({ where: { id } });

		res.sendStatus(200);
	} catch (err) {
		return next(err);
	}
};

exports.deleteType = async (req, res, next) => {
	try {
		const { id } = req.body;

		await ProductTypes.destroy({ where: { TypeId: id } });
		await TypeModel.destroy({ where: { id } });

		res.sendStatus(200);
	} catch (err) {
		return next(err);
	}
};

exports.searchProduct = async (req, res, next) => {
	try {
		const { name } = req.query;

		/* 		const elasticIndex = await elasticClient.indices.exists({
			index: "products",
		}); */

		const result = await elasticClient.search({
			index: "products",
			query: { fuzzy: { name: name.toLowerCase() } },
			min_score: 0.5,
		});

		const products = result.hits.hits.map((hit) => hit._source);

		res.json(products);
	} catch (err) {
		return next(err);
	}
};
