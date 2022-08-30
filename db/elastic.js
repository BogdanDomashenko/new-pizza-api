const { Client } = require("@elastic/elasticsearch");

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
exports.elasticClient = new Client({ node: elasticUrl });
