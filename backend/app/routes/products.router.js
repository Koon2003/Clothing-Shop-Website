// Khai báo thư viện express
const express = require("express");
const router = express.Router();

//import controller
const { getAllProducts, checkProductExists, getRelatedProductsById, getFeaturedProducts, getProductsByCategory, createOrUpdateProduct, getProductById, updateProductById, deleteProductById, searchProducts, deleteCommonImages, deleteVariantImages, deleteVariant, getAllProductsList } = require("../controllers/products.controller");
const { verifyToken, checkUser } = require("../middlewares/user.middleware");


router.use((req, res, next) => {
    console.log("Request URL Courses: ", req.url);

    next();
});

//gọi từ controller
// Route lấy danh sách sản phẩm đã phân trang trên backend
router.get("/", getAllProducts);

//Route lấy danh sách toàn bộ sản phẩm
router.get("/allProducts", getAllProductsList);

// Route tạo product mới
router.post("/", checkProductExists, createOrUpdateProduct);

//Route to search products
router.get('/search', searchProducts);

// Route to get featured products
router.get('/featured', getFeaturedProducts);

// Route to get products by category
router.get("/category/:categoryId", getProductsByCategory);

//Get Id
router.get("/:productId", getProductById);

// Route to get related products
router.get('/:productId/related', getRelatedProductsById);

// Route to update products
router.put("/:productId", verifyToken, checkUser, updateProductById);

// Route để xóa ảnh commonImages của sản phẩm
router.delete('/:productId/deleteCommonImages', verifyToken, checkUser, deleteCommonImages);

// Route để xóa ảnh variants của sản phẩm
router.delete('/:productId/variants/:variantSlug/deleteImages', verifyToken, checkUser, deleteVariantImages);

// Route để xóa biến thể của sản phẩm
router.delete('/:productId/variants/:variantSlug', verifyToken, checkUser, deleteVariant);

// Route to delete products
router.delete("/:productId", verifyToken, checkUser, deleteProductById);

module.exports = router;