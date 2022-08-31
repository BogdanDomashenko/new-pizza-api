require("dotenv").config();
const cron = require("node-cron");
const sequelize = require("../db/db");
const { elasticClient } = require("../db/elastic");
const { ProductService } = require("../services/ProductService");

const esAction = {
	index: {
		_index: "products",
	},
};

exports.ElasticDeamon = {
	start() {
		this.update();
		cron.schedule("0 * * * *", this.update);
	},
	async update() {
		try {
			await sequelize.authenticate();
			await sequelize.sync();

			const products = await ProductService.getAllAvailable();

			const elasticIndex = await elasticClient.indices.exists({
				index: "products",
			});

			if (elasticIndex) {
				await elasticClient.indices.delete({ index: "products" });
			}

			await elasticClient.indices.create({ index: "products" });

			const docs = [];
			for (const product of products) {
				docs.push(esAction);
				docs.push(product);
			}

			await elasticClient.bulk({ body: docs });
			/* 
			if (!elasticIndex) {
				await elasticClient.indices.create({ index: "products" });
				await elasticClient.bulk({ body: docs });
			} else {
				await elasticClient.indices.putMapping({
					index: "products",
					body: docs,
				});
			} */

			console.log("Elastic updated!");
		} catch (e) {
			console.log(e);
		}
	},
};
