const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;

const userModel = new Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  customer: {
    type: String,
    ref: "Customer", // Liên kết với Customer model
  },
  roles: [
    {
      type: String,
      ref: "Role", // Liên kết với Role model
    },
  ],
});



module.exports = mongoose.model("User", userModel);
