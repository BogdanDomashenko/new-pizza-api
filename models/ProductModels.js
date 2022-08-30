const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const ProductModel = sequelize.define("Products", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING },
	price: { type: DataTypes.INTEGER },
	rating: { type: DataTypes.INTEGER },
});

const CategoryModel = sequelize.define("Categories", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING },
});

const ProductImage = sequelize.define("ProductImages", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	url: { type: DataTypes.STRING },
});

const TypeModel = sequelize.define("Types", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING(45) },
	price: { type: DataTypes.INTEGER },
});

const SizeModel = sequelize.define("Sizes", {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING(45) },
	price: { type: DataTypes.INTEGER },
});

const ProductTypes = sequelize.define("ProductTypes", {});
const ProductSizes = sequelize.define("ProductSizes", {});

CategoryModel.hasOne(ProductModel, { foreignKey: "categoryId" });
ProductModel.belongsTo(CategoryModel, { foreignKey: "categoryId" });

ProductModel.hasMany(ProductImage);
ProductImage.belongsTo(ProductModel);

ProductModel.belongsToMany(TypeModel, { through: ProductTypes });
TypeModel.belongsToMany(ProductModel, { through: ProductTypes });

ProductModel.belongsToMany(SizeModel, { through: ProductSizes });
SizeModel.belongsToMany(ProductModel, { through: ProductSizes });

module.exports = {
	ProductModel,
	ProductImage,
	CategoryModel,
	SizeModel,
	TypeModel,
	ProductSizes,
	ProductTypes,
};
