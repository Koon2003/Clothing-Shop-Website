const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    _id: {
        type: String,
        default: function () {
            // Tạo ID dựa trên ngày hiện tại và một định danh ngẫu nhiên
            const date = new Date();
            const dateString = date.toISOString().split('T')[0]; // Lấy ngày dưới dạng YYYY-MM-DD
            const uniqueIdentifier = shortid.generate(); // Tạo một định danh ngẫu nhiên
            return `ORD-${dateString}-${uniqueIdentifier}`;
        }
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    products: [
        {
            product: {
                type: String,
                ref: 'Product'
            },
            quantity: Number,
            size: String,
            color: String,
            promotionPrice: Number,
            _id: false
        }
    ],
    totalQuantity: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 0
    },
    customer: {
        type: String,
        ref: 'Customer'
    },
    status: {
        type: String,
        enum: ['Pending', 'Canceled', 'Done'],
        default: 'Pending' // Default status for new orders
    },
    voucher: {
        type: String,
        ref: 'Voucher' // Thêm trường voucher tham chiếu đến Voucher model
    },
    paymentType: {
        type: String,
        enum: ['COD', 'BankTransfer'],
        required: true
    },
});

// Sử dụng hàm populate trong query để lấy thông tin chi tiết của khách hàng
orderSchema.virtual('customerDetails', {
    ref: 'Customer',
    localField: 'customer',
    foreignField: '_id',
    justOne: true // chỉ trả về một đối tượng khách hàng
});

// Đảm bảo rằng thông tin khách hàng được include khi convert sang JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
