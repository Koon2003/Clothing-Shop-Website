const express = require("express");
const route = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const refreshTokenService = require("../services/refreshToken.service");


const authController = require("../controllers/auth.controller");

//Login user
route.post("/login", authController.login);


module.exports = route;