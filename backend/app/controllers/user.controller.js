const db = require("../models")
//Khai bao thu vien mongoose
const mongoose = require("mongoose");

const createUserFromEmail = async (req, res) => {
    const { email } = req.body;
    console.log(email);

    if (!email) {
        return res.status(400).json({ message: "Cần nhập Email!" });
    }

    try {
        let user = await db.user.findOne({ email: email });

        if (!user) {
            user = new db.user({ email, roles: ["user"] });
            await user.save();
            // Kiểm tra xem có customer nào với email này chưa
            const customer = await db.customer.findOne({ email });
            if (customer) {
                user.customer = customer._id;
                await user.save();
            }
        }

        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Có lỗi khi tạo User", error: error.message });
    }
};

//create user
const createUser = async (req, res) => {
    const { username, password, customerId } = req.body;

    if (!username) {
        return res.status(400).json({
            status: "Bad request",
            message: "Username is required"
        })
    };

    if (!password) {
        return res.status(400).json({
            status: "Bad request",
            message: "Password is required"
        })
    };

    //Xu ly
    try {
        let newUser = new db.user({ username, password, customer: customerId }); // Sử dụng constructor mới
        const userCreated = await newUser.save(); // Lưu user
        return res.status(201).json({
            message: "Create Success",
            data: userCreated
        })
    }
    catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: error.message
        })
    }
}

//Get all user
const getAllUser = async (req, res) => {
    try {

        const getAllUser = await db.user.find()
        return res.status(200).json({
            message: "Get all Success",
            data: getAllUser
        })
    }
    catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: error.message
        })
    }
}

//update user
const updateUser = async (req, res) => {
    const userId = req.params._id;
    const { username, password, customerId } = req.body;

    if (!username) {
        return res.status(400).json({
            status: "Bad request",
            message: "username is required"
        })
    };

    if (!password) {
        return res.status(400).json({
            status: "Bad request",
            message: "password is required"
        })
    };

    //Xu ly
    try {
        let updateData = { username, password, customer: customerId };
        const updatedUser = await db.user.findByIdAndUpdate(userId, updateData, { new: true });
        return res.status(200).json({
            message: "Update Success",
            data: updated
        })
    }
    catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: error.message
        })
    }

}

//delete user
const deleteUser = async (req, res) => {
    const userId = req.params._id;

    //Xu ly
    try {
        const deleted = await db.user.findByIdAndDelete(userId)
        return res.status(200).json({
            message: "Delete Success",
            data: deleted
        })
    }
    catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: error.message
        })
    }
}

module.exports = {
    createUserFromEmail, createUser, getAllUser, updateUser, deleteUser
}
