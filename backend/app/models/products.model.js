const mongoose = require('mongoose');
const slugify = require('slugify');
const removeDiacritics = require('remove-diacritics');
const Schema = mongoose.Schema;

// Định nghĩa Schema cho size
const sizeSchema = new Schema({
    size: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    isInStock: {
        type: Boolean,
        default: true
    },
    slug: String  // Thêm slug cho mỗi kích thước
}, { _id: false });

// Định nghĩa Schema cho variant
const variantSchema = new Schema({
    color: {
        type: String,
        required: true
    },
    imageUrl: [String],
    sizes: [sizeSchema],  // Sử dụng sizeSchema đã định nghĩa
    slug: String  // Thêm slug cho mỗi biến thể màu
}, { _id: false });

// Định nghĩa Product Schema
const productSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            const slug = removeDiacritics(this.name);
            return slugify(slug, { lower: true, strict: true });
        }
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        ref: "Category",
        required: true
    },
    description: {
        type: String
    },
    buyPrice: {
        type: Number,
        required: true
    },
    promotionPrice: {
        type: Number
    },
    commonImages: [String],
    isFeatured: {
        type: Boolean,
        default: false, // Set a default value if you want all products to be not featured initially
    },
    variants: [variantSchema]
});

// Tạo slug cho sản phẩm và biến thể
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        const slug = removeDiacritics(this.name);
        this._id = slugify(slug, { lower: true, strict: true });
    }

    this.variants.forEach(variant => {
        if (this.isModified('name') || variant.isModified('color')) {
            const slug = removeDiacritics(`${this.name}-${variant.color}`);
            variant.slug = slugify(slug, { lower: true, strict: true });
        }

        variant.sizes.forEach(size => {
            if (variant.isModified('color') || size.isModified('size')) {
                const slug = removeDiacritics(`${variant.slug}-${size.size}`);
                size.slug = slugify(slug, { lower: true, strict: true });
            }
        });
    });

    next();
});

module.exports = mongoose.model("Product", productSchema);
