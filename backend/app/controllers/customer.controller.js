const db = require('../models'); // Đảm bảo rằng đường dẫn đúng
const shortid = require('shortid');

//Kiểm tra định dạng email và phone
const validateEmail = email => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validatePhone = phone => /^\d{10,11}$/.test(phone);

// Tạo Khách Hàng Mới
const createCustomer = async (req, res) => {
    const { fullName, phone, email, address, city, district, ward, country, orders } = req.body;

    // Kiểm tra dữ liệu nhập vào
    if (!fullName || !phone || !email) {
        return res.status(400).json({ message: 'FullName, phone, and email are required.' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!validatePhone(phone)) {
        return res.status(400).json({ message: 'Phone number must be 10 to 11 digits.' });
    }

    try {
        let customer = await db.customer.findOne({ email });

        if (customer) {
            // Cập nhật khách hàng hiện tại
            customer.fullName = fullName;
            customer.email = email;
            customer.address = address;
            customer.city = city;
            customer.district = district;
            customer.ward = ward;
            customer.country = country;
            customer.orders = orders || customer.orders;
            await customer.save();
        } else {
            // Tạo khách hàng mới
            customer = await db.customer.create({ fullName, phone, email, address, city, district, ward, country, orders });
            // Tạo hoặc lấy user dựa trên email
            const user = await db.user.findOneAndUpdate({ email }, { $set: { customer: customer._id } }, { new: true, upsert: true });
            customer.user = user._id; // Gán user id cho customer
            await customer.save();
        }

        return res.status(201).json({
            customerId: customer._id,
            fullName: customer.fullName,
            email: customer.email
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy Tất Cả Khách Hàng
const getAllCustomers = async (req, res) => {
    try {
        const customers = await db.customer.find();
        return res.status(200).json({ data: customers });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy khách hàng theo email
const getCustomerByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const customer = await db.customer.findOne({ email: email });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        return res.status(200).json(customer);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm kiểm tra số điện thoại đã tồn tại hay chưa
const checkPhoneExists = async (req, res) => {
    const { phone } = req.params;
    try {
        // Giả định rằng bạn có một method 'findOne' tìm kiếm khách hàng theo số điện thoại
        const customer = await db.customer.findOne({ phone: phone });

        // Nếu có khách hàng sử dụng số điện thoại này, trả về kết quả là true
        if (customer) {
            return res.status(200).json({ exists: true });
        } else {
            // Nếu không tìm thấy khách hàng, trả về kết quả là false
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        return res.status(500).json({ message: error.message });
    }
};

// Lấy Khách Hàng Theo ID
const getCustomerById = async (req, res) => {
    const { customerId } = req.params;

    try {
        const customer = await db.customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng!' });
        }
        return res.status(200).json({ data: customer });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập Nhật Khách Hàng Theo ID
const updateCustomerById = async (req, res) => {
    const { customerId } = req.params;
    const { fullName, email, phone, address, city, district, ward, orders, userId } = req.body;

    // Kiểm tra dữ liệu nhập vào
    if (!fullName || !phone || !email) {
        return res.status(400).json({ message: 'FullName, phone, and email are required.' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    if (!validatePhone(phone)) {
        return res.status(400).json({ message: 'Phone number must be 10 to 11 digits.' });
    }

    try {
        const updateData = { fullName, email, address, city, district, ward, orders, user: userId };
        const updatedCustomer = await db.customer.findByIdAndUpdate(customerId, updateData, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng!' });
        }
        return res.status(200).json({ data: updatedCustomer });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa Khách Hàng Theo ID
const deleteCustomerById = async (req, res) => {
    const { customerId } = req.params;
    const forceDelete = req.query.forceDelete === 'true'; // Lấy tham số forceDelete từ query

    try {
        if (!forceDelete) {
            // Kiểm tra xem có đơn hàng liên quan không
            const orders = await db.order.find({ customer: customerId });
            if (orders && orders.length > 0) {
                return res.status(400).json({
                    message: 'Customer has related orders. Do you want to delete the customer?',
                    hasOrders: true
                });
            }
        }

        // Xóa khách hàng
        await db.customer.findByIdAndDelete(customerId);
        return res.status(200).json({ message: 'Customer deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Get all orders of a specific customer
const getAllOrdersOfCustomer = async (req, res) => {
    const { customerId } = req.params;

    try {
        // Assuming 'orders' field in customer document contains the list of order IDs
        const customer = await db.customer.findById(customerId).populate('orders');
        if (!customer) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng!' });
        }

        // Return the populated orders
        return res.status(200).json({ orders: customer.orders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    getCustomerByEmail,
    checkPhoneExists,
    getAllOrdersOfCustomer,
    updateCustomerById,
    deleteCustomerById
};
