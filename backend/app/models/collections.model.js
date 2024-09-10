const mongoose = require('mongoose');
const shortid = require('shortid');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            // Sử dụng slugify với name; sử dụng shortid làm fallback nếu fullName không tồn tại
            return this.name ? slugify(this.name, { lower: true, strict: true }) : shortid.generate();
        }
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [{ type: String }],
},
    { timestamps: true }
);

//Kiểm tra slug Id đã tồn tại chưa? Nếu tồn tại thì tạo 1 biến thể khác
collectionSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('name')) {
        let slug = slugify(this.name, { lower: true, strict: true });
        let count = await mongoose.model('Customer').countDocuments({ _id: new RegExp(slug) });
        if (count > 0) {
            slug += '-' + shortid.generate();
        }
        this._id = slug;
    }
    next();
});

module.exports = mongoose.model('Collection', collectionSchema);
