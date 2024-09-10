const mongoose = require("mongoose");
const shortid = require("shortid");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  _id: {
    type: String,
    default: function () {
      // Sử dụng slugify với fullName; sử dụng shortid làm fallback nếu fullName không tồn tại
      return this.fullName
        ? slugify(this.fullName, { lower: true, strict: true })
        : shortid.generate();
    },
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  ward: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "Việt Nam",
  },
  orders: [
    {
      type: String,
      ref: "Order",
    },
  ],
  user: {
    type: String,
    ref: "User",
  },
});

//Kiểm tra slug Id đã tồn tại chưa? Nếu tồn tại thì tạo 1 biến thể khác
customerSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('fullName')) {
        let slug = slugify(this.fullName, { lower: true, strict: true });
        let count = await mongoose.model('Customer').countDocuments({ _id: new RegExp(slug) });
        if (count > 0) {
            slug += '-' + shortid.generate();
        }
        this._id = slug;
    }
    next();
});

module.exports = mongoose.model("Customer", customerSchema);
