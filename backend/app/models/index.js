const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.category = require("./category.model");
db.product = require("./products.model");

db.user = require("./user.model");
db.role = require("./roles.model");
db.refreshToken = require("./refreshToken.model");
db.customer = require("./customers.model");
db.order = require("./orders.model");
db.voucher = require("./voucher.model");
db.collections = require("./collections.model");

module.exports = db;
