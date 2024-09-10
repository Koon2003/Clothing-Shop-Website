const mongoose = require("mongoose");
const shortid = require("shortid");

const voucherSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  description: String,
  expiresAt: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Voucher", voucherSchema);
