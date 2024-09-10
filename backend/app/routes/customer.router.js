// Khai báo thư viện express
const express = require("express");

//import controller
const {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
  getAllOrdersOfCustomer,
  getCustomerByEmail,
  checkPhoneExists,
} = require("../controllers/customer.controller");
const { verifyToken, checkUser } = require("../middlewares/user.middleware");

const router = express.Router();

router.use((req, res, next) => {
  console.log("Request URL Courses: ", req.url);

  next();
});

//gọi từ controller
router.get("/", getAllCustomers);

router.post("/", createCustomer);

router.get("/:customerId", getCustomerById);

router.get("/email/:email", getCustomerByEmail);

// Kiểm tra số điện thoại đã tồn tại hay chưa
router.get("/check-phone/:phone", checkPhoneExists);

//Get All orders of Customers
router.get("/:customerId/orders", getAllOrdersOfCustomer);

router.put("/:customerId", updateCustomerById);

router.delete("/:customerId", verifyToken, checkUser, deleteCustomerById);

module.exports = router;
