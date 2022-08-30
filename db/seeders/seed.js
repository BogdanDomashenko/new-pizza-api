require("dotenv").config();
const sequelize = require("../db");
const { seedProducts } = require("./Products/seedProducts");
const { seedUsers } = require("./User/seedUsers");

const seed = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();

		//await seedProducts();
		//await seedUsers();
	} catch (e) {
		console.log(e);
	}
};

seed();
