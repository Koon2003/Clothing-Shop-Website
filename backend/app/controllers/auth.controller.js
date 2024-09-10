const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const refreshTokenService = require("../services/refreshToken.service");

require("dotenv").config();
const DbSecretKey = process.env.JWT_SECRET_KEY;

//Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existUser = await db.user.findOne({ email }).populate("roles");
    console.log(existUser);
    if (!existUser) {
      return res.status(404).json({ message: "Không tìm thấy User" });
    }
    const passwordIsValid = bcrypt.compareSync(password, existUser.password);

    if (!passwordIsValid) {
      res.status(401).json({ message: "Mật khẩu không đúng!" });
      return;
    }
    const secretkey = DbSecretKey;
    const token = jwt.sign({ id: existUser._id }, secretkey, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 1 ngay
    });
    const refreshToken = await refreshTokenService.createToken(existUser);
    const userRoles = existUser.roles.map((role) => role.name);

    res.status(200).json({
      accessToken: token,
      refreshToken: refreshToken,
      userRole: userRoles,
      email: existUser.email,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  login,
};
