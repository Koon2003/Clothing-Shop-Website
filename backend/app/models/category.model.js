const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const categorySchema = new Schema({
  _id: {
    type: String,
    default: function () {
      return slugify(this.name, { lower: true, strict: true });
    },
  },
  name: {
    type: String,
    required: true,
    unique: true, // Mỗi danh mục có tên duy nhất
  },
  description: {
    type: String,
    required: true,
  }, // Mô tả về danh mục
});

module.exports = mongoose.model("Category", categorySchema);
