const db = require("../models");

// Get Category by ID
const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await db.category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error finding category", error: error.message });
  }
};

// Create Category
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }
  // Kiểm tra trùng lặp tên danh mục
  const existingCategory = await db.category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category name already exists" });
  }

  try {
    const newCategory = { name, description };
    const createCategory = await db.category.create(newCategory);
    return res.status(201).json({
      message: "Category created successfully",
      data: createdCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

// Update Category
const updateCategoryById = async (req, res) => {
  const { categoryId, name } = req.params;
  const updateData = req.body;

  // Kiểm tra trùng lặp tên danh mục
  //const existingCategory = await db.category.findOne({ name, _id: { $ne: categoryId } });
  //if (existingCategory) {
  //    return res.status(400).json({ message: "Category name already exists" });
  //}

  try {
    const updatedCategory = await db.category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

// Get All Categories
const getAllCategories = async (req, res) => {
  try {
    const allCategories = await db.category.find();
    return res
      .status(200)
      .json({
        message: "Successfully retrieved all categories",
        data: allCategories,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving categories", error: error.message });
  }
};

// Delete Category
const deleteCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const deletedCategory = await db.category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

module.exports = {
    getCategoryById,
    createCategory,
    updateCategoryById,
    getAllCategories,
    deleteCategoryById
};