const db = require("../models"); // Đường dẫn đến thư mục models

// Get All Orders
const getAllOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    try {
        const [allOrders, total] = await Promise.all([
            db.order.find().populate('products.product').populate('customerDetails', 'fullName').sort({ _id: 1 }).skip(skipIndex).limit(limit),
            db.order.countDocuments()
        ]);

        return res.status(200).json({ data: allOrders, total });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Order by ID
const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await db.order.findById(orderId).populate('products.product');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({ data: order });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Create Order
const createOrder = async (req, res) => {
    const { orderDate, products, totalQuantity, cost, customer, status, voucherCode, paymentType } = req.body;

    // Validate input data
    // Xác thực dữ liệu products
    if (!products || !Array.isArray(products) || products.length === 0 ||
        products.some(p => !p.product || !p.quantity || !p.size || !p.color || !p.promotionPrice)) {
        return res.status(400).json({ message: "Invalid products data." });
    }

    if (totalQuantity === undefined || totalQuantity < 0) {
        return res.status(400).json({ message: "Total quantity must be a non-negative number." });
    }
    if (!cost || cost < 0) {
        return res.status(400).json({ message: "Cost must be a non-negative number." });
    }

    // Kiểm tra paymentType
    if (!paymentType || (paymentType !== 'COD' && paymentType !== 'BankTransfer')) {
        return res.status(400).json({ message: "Invalid payment type." });
    }

    // Cập nhật số lượng sản phẩm trong kho
    try {
        for (let item of products) {
            const product = await db.product.findById(item.product);
            if (!product) {
                throw new Error(`Sản phẩm không tồn tại: ${item.product}`);
            }
            // Tìm biến thể tương ứng với màu sắc
            const variant = product.variants.find(v => v.color === item.color);
            if (!variant) {
                throw new Error(`Biến thể không tồn tại: ${item.color} cho sản phẩm ${product.name}`);
            }

            // Tìm kích thước tương ứng
            const size = variant.sizes.find(s => s.size === item.size);
            if (!size) {
                throw new Error(`Kích thước không tồn tại: ${item.size} cho biến thể ${variant.color}`);
            }

            // Kiểm tra số lượng tồn kho
            if (size.amount < item.quantity) {
                throw new Error(`Không đủ hàng: ${product.name}, ${variant.color}, size ${size.size}`);
            }

            // Cập nhật số lượng tồn kho
            size.amount -= item.quantity;

            // Lưu thay đổi ngay sau khi cập nhật số lượng
            await product.save();
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    try {
        let discountAmount = 0;
        // Kiểm tra voucherCode
        if (voucherCode) {
            const voucher = await db.voucher.findOne({ code: voucherCode, isActive: true });
            if (!voucher || voucher.expiresAt < new Date()) {
                return res.status(400).json({ message: "Invalid or expired voucher code." });
            }
            discountAmount = voucher.discount;
        }
        // Tính toán giá cuối cùng
        const finalCost = Math.max(0, cost - discountAmount);

        // Chuyển đổi ngày tháng
        let parsedOrderDate;
        if (orderDate) {
            const [day, month, year] = orderDate.split("/").map(Number);
            parsedOrderDate = new Date(year, month - 1, day);
        } else {
            parsedOrderDate = new Date();
        }

        const newOrder = {
            orderDate: parsedOrderDate,
            products,
            totalQuantity,
            cost: finalCost,
            customer,
            status: status || 'Pending',
            voucher: voucherCode,
            paymentType
        };

        // Tạo đơn hàng mới
        const createdOrder = await db.order.create(newOrder);

        // Cập nhật mảng orders của customer
        await db.customer.findByIdAndUpdate(customer, { $push: { orders: createdOrder._id } });

        // Trả về kết quả
        return res.status(201).json({
            message: "Order created successfully.",
            data: createdOrder,
            orderId: createdOrder._id
        });
    } catch (error) {
        console.log("Error in createOrder:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Update Order by ID
const updateOrderById = async (req, res) => {
    const { orderId } = req.params;
    const { products, totalQuantity, cost, status, paymentType } = req.body;

    // Validate input data
    if (products && (!Array.isArray(products) || products.length === 0)) {
        return res.status(400).json({ message: "Products must be an array." });
    }
    if (totalQuantity !== undefined && totalQuantity < 0) {
        return res.status(400).json({ message: "Total quantity must be non-negative." });
    }
    if (cost !== undefined && cost < 0) {
        return res.status(400).json({ message: "Cost must be non-negative." });
    }

    try {
        const existingOrder = await db.order.findById(orderId);
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found." });
        }

        const updateData = {
            products: products || existingOrder.products,
            totalQuantity: totalQuantity || existingOrder.totalQuantity,
            cost: cost || existingOrder.cost,
            status: status || existingOrder.status,
            paymentType: paymentType || existingOrder.paymentType
        };

        const updatedOrder = await db.order.findByIdAndUpdate(orderId, updateData, { new: true });
        return res.status(200).json({
            message: "Order updated successfully.",
            data: updatedOrder
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete Order by ID
const deleteOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const deletedOrder = await db.order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderById,
    deleteOrderById
};
