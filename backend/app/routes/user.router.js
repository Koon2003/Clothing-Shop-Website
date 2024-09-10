const express = require("express");

const route = express.Router();

const {
  createUserFromEmail,
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { verifyToken, checkUser } = require("../middlewares/user.middleware");

route.get("/", getAllUser);

route.post("/create-from-email", createUserFromEmail);

route.put("/:_id", verifyToken, checkUser, updateUser);

route.delete("/:_id", verifyToken, checkUser, deleteUser);

module.exports = route;
