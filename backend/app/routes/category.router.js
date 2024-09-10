const express = require("express");

//import controller
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/category.controller");

const router = express.Router();

router.use((req, res, next) => {
  console.log("Request URL Courses: ", req.url);

  next();
});

//gọi từ controller
router.get("/", getAllCategories);

router.post("/", createCategory);

//Get Id
router.get("/:categoryId", getCategoryById);

router.put("/:categoryId", updateCategoryById);

router.delete("/:categoryId", deleteCategoryById);

module.exports = router;
