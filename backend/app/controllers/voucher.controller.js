const db = require("../models"); // Đảm bảo rằng đường dẫn đúng

// Create Voucher
const createVoucher = async (req, res) => {
    const { code, discount, description, expiresAt } = req.body;

    // Kiểm tra dữ liệu nhập vào
    if (!code || !discount || !expiresAt) {
        return res.status(400).json({ message: 'Code, discount, và expiresAt là bắt buộc.' });
    }

    try {
        const newVoucher = await db.voucher.create({ code, discount, description, expiresAt });
        return res.status(201).json({
            message: "Tạo voucher thành công!",
            data: newVoucher
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get All Vouchers
const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await db.voucher.find();
        return res.status(200).json({ data: vouchers });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Voucher By ID
const getVoucherById = async (req, res) => {
    const { voucherId } = req.params;

    try {
        const voucher = await db.voucher.findById(voucherId);
        if (!voucher) {
            return res.status(404).json({ message: 'Không tìm thấy voucher!' });
        }
        return res.status(200).json({ data: voucher });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Voucher By Code
const getVoucherByCode = async (req, res) => {
    const { code } = req.params;
    try {
        const voucher = await db.voucher.findOne({ code: code, isActive: true });
        if (!voucher) {
            return res.status(404).json({ message: 'Voucher không hợp lệ hoặc đã hết hạn!' });
        }
        return res.status(200).json({ data: voucher });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update Voucher By ID
const updateVoucherById = async (req, res) => {
    const { voucherId } = req.params;
    console.log(voucherId);
    const updateData = req.body;

    try {
        const updatedVoucher = await db.voucher.findByIdAndUpdate(voucherId, updateData, { new: true });
        if (!updatedVoucher) {
            return res.status(404).json({ message: 'Không tìm thấy voucher!' });
        }
        return res.status(200).json({ data: updatedVoucher });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete Voucher By ID
const deleteVoucherById = async (req, res) => {
    const { voucherId } = req.params;

    try {
        const deletedVoucher = await db.voucher.findByIdAndDelete(voucherId);
        if (!deletedVoucher) {
            return res.status(404).json({ message: 'Không tìm thấy voucher!' });
        }
        return res.status(200).json({ message: 'Voucher đã được xóa thành công.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVoucher,
    getAllVouchers,
    getVoucherById,
    getVoucherByCode,
    updateVoucherById,
    deleteVoucherById
};
