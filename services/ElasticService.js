const { ProductService } = require("./ProductService");

exports.ElasticService = {
	async create(instance, options) {
		console.log(instance, options);
		//await ProductService.getAvailable(21);
	},
	async delete(instance) {
		const { id } = instance;
		console.log("deleted", { instance });
	},
	async update(instance) {
		const { id } = instance;
		console.log("updated", { instance });
	},
};
