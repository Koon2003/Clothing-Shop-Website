const mongoose = require("mongoose");
const slugify = require("slugify");

const roleModel = new mongoose.Schema({
  _id: {
    type: String,
    default: function () {
      return slugify(this.name, { lower: true, strict: true });
    },
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("Role", roleModel);
