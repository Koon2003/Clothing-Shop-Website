const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const db = require("../models");

const createToken = async (user) => {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + 3600 //1 gio refresh 1 lan
  );

  let token = uuidv4();
  let refreshTokenObj = new db.refreshToken({
    token: token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });
  const refreshToken = await refreshTokenObj.save();
  return refreshToken.token;
};

module.exports = {
  createToken,
};
