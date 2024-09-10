const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("./app/models");

require("dotenv").config();

async function dataLoad() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Unable connecting to MongoDB Atlas!");
  }

  // Tạo một tài liệu mới
  const createNewRole = async (roleName) => {
    try {
      const newRole = await db.role.create({ name: roleName });
      await newRole.save();
      console.log("Role created:", newRole);
    } catch (error) {
      console.error("Error creating role:", error);
    } finally {
      mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
    }
  };

  // User
  const createNewUser = async (email, password, customer, roles) => {
    try {
      const newUser = await db.user.create({
        email: email,
        password: bcrypt.hashSync(password , 6),
        customer: customer,
        roles: roles,
      });
      await newUser.save();
      console.log("User created:", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      mongoose.connection.close();
    }
  };

  const createCategory = async (name, description) => {
    try {
      const newCategory = await db.category.create({name, description});
      await newCategory.save();
      console.log("Category created:", newCategory);
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      mongoose.connection.close();
    }
  };

  // Gọi hàm để tạo tài liệu mới với tên vai trò cụ thể
  //createNewRole("Admin");
  //createNewUser("admin@gmail.com", "12345678", null, ["admin"]);
  createCategory("Áo sơ mi", "Áo sơ mi nhà TAN");
}

dataLoad();
