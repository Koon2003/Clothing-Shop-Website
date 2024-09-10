// Khai báo thư viện express
const express = require("express");

// Import controller
const {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  getVoucherByCode,
  updateVoucherById,
  deleteVoucherById,
} = require("../controllers/voucher.controller");

// Import Middlewares
const { verifyToken, checkUser } = require("../middlewares/user.middleware");

const router = express.Router();

router.use((req, res, next) => {
  console.log("Request URL Vouchers: ", req.url);
  next();
});

// Gọi từ controller
router.post("/", verifyToken, checkUser, createVoucher); // Tạo voucher mới
router.get("/", getAllVouchers); // Lấy tất cả voucher
router.get("/:voucherId", getVoucherById); // Lấy voucher theo ID
router.get("/code/:code", getVoucherByCode); // Lấy voucher theo code

router.put("/:voucherId", verifyToken, checkUser, updateVoucherById); // Cập nhật voucher theo ID
router.delete("/:voucherId", verifyToken, checkUser, deleteVoucherById); // Xóa voucher theo ID

module.exports = router;
