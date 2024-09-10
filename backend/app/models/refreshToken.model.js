const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
