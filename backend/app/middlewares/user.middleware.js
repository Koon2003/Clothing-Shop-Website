const db = require("../models");
const jwt = require("jsonwebtoken");

const User = db.user;
const Role = db.role;

require("dotenv").config();
const DbSecretKey = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
  console.log("verify token ...");
  let token = req.headers["authorization"];
  if (token && token.startsWith("Bearer ")) {
    // Cắt bỏ phần "Bearer " để lấy token thực sự
    token = token.slice(7, token.length);
  }

  console.log(token);
  if (!token) {
    return res.status(401).send({
      message: "Không tìm thấy token!",
    });
  }

  try {
    const verified = jwt.verify(token, DbSecretKey);
    console.log(verified);
    const user = await User.findById(verified.id).populate("roles");
    if (!user) {
      return res.status(401).send({
        message: "Người dùng không tồn tại!",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    return res.status(401).send({
      message: "Token không hợp lệ!",
    });
  }
};

const checkUser = (req, res, next) => {
  const userRoles = req.user.roles;
  console.log(userRoles);
  // Kiểm tra xem mảng userRoles có ít nhất một role với tên là 'Admin'
  const isAdmin = userRoles.some((role) => role.name === "Admin");
  if (isAdmin) {
    console.log("Authorized!");
    next();
  } else {
    console.log("Unauthorized");
    return res.status(401).send({
      message: "Bạn không có quyền truy cập!",
    });
  }
};

module.exports = {
  verifyToken,
  checkUser,
};
