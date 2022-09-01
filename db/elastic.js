const { Client } = require("@elastic/elasticsearch");
const { ProductService } = require("../services/ProductService");

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
exports.elasticClient = new Client({ node: elasticUrl });

exports.elsaticConnect = async () => {
	try {
		const products = await ProductService.getAvailable();

		const elasticIndex = await this.elasticClient.indices.exists({
			index: "products",
		});

		console.log("Elastic connected!");

		/* if (elasticIndex) {
			await this.elasticClient.indices.delete({ index: "products" });
		}

		await this.elasticClient.indices.create({ index: "products" });
 */

		if (!elasticIndex) {
			await this.elasticClient.indices.create({ index: "products" });
		}

		const docs = [];
		for (const product of products) {
			docs.push({
				index: {
					_index: "products",
					_id: product.id,
				},
			});
			docs.push(product);
		}

		await this.elasticClient.bulk({ body: docs });

		console.log("Elastic updated!");
	} catch (e) {
		console.log(e);
	}
};
