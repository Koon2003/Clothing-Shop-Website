// Khai báo thư viện express
const express = require("express");
const router = express.Router();
//import controller
const { getAllOrders, getOrderById, createOrder, updateOrderById, deleteOrderById } = require("../controllers/order.controller");
const { verifyToken, checkUser } = require("../middlewares/user.middleware");


router.use((req, res, next) => {
    console.log("Request URL Courses: ", req.url);

    next();
});

// Lấy tất cả đơn hàng
router.get('/', getAllOrders);

// Lấy đơn hàng theo ID
router.get('/:orderId', getOrderById);

// Tạo đơn hàng mới
router.post('/', createOrder);

// Cập nhật đơn hàng theo ID
router.put('/:orderId', verifyToken, checkUser, updateOrderById);

// Xóa đơn hàng theo ID
router.delete('/:orderId', verifyToken, checkUser, deleteOrderById);


module.exports = router;