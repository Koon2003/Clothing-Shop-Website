const db = require("../models"); // Đường dẫn đến thư mục models

// Hàm lấy danh sách sản phẩm đã phân trang ở backend
const getAllProducts = async (req, res) => {
    const { page = 1, limit = 10, name, category } = req.query;

    try {
        let filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
        }
        if (category) {
            filter.category = category;
        }

        const total = await db.product.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;

        const products = await db.product.find(filter).limit(limit).skip(startIndex);

        return res.status(200).json({
            data: products,
            page,
            totalPages,
            limit,
            total
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving products",
            error: error.message
        });
    }
};

// Hàm lấy danh sách toàn bộ sản phẩm
const getAllProductsList = async (req, res) => {
    try {
        const products = await db.product.find();
        return res.status(200).json({
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving products",
            error: error.message
        });
    }
};

//Check if products exist
const checkProductExists = async (req, res, next) => {
    const { name, variants } = req.body;

    try {
        const existingProduct = await db.product.findOne({ name });

        if (existingProduct) {
            // Kiểm tra xem biến thể mới có trùng lặp với biến thể hiện có không
            const variantExists = variants.some(variant =>
                existingProduct.variants.some(ev =>
                    ev.color === variant.color && ev.sizes.some(size => variant.sizes.includes(size))
                )
            );

            if (variantExists) {
                return res.status(400).json({
                    message: "Product with this name and variant already exists"
                });
            }
        }

        next(); // Tiếp tục nếu không có mâu thuẫn
    } catch (error) {
        return res.status(500).json({
            message: "Error checking if product exists",
            error: error.message
        });
    }
};

// Get Related Products
const getRelatedProductsById = async (req, res) => {
    const { productId } = req.params;

    try {
        // Assuming 'category' field exists and is indexed in your product schema
        const product = await db.product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const relatedProducts = await db.product.find({
            _id: { $ne: productId }, // Exclude the current product
            category: product.category // Match the category
        }).limit(5); // Limit the number of related products returned

        return res.status(200).json({
            message: "Related products retrieved successfully",
            data: relatedProducts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving related products",
            error: error.message
        });
    }
};

// Get Featured Products
const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await db.product.find({ isFeatured: true });
        return res.status(200).json({
            message: "Featured products retrieved successfully",
            data: featuredProducts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving featured products",
            error: error.message
        });
    }
};

// Hàm lấy sản phẩm theo danh mục
const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const category = await db.category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const products = await db.product.find({ category: categoryId });
        return res.status(200).json({ data: products, categoryName: category.name });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm tìm kiếm sản phẩm theo tên và category
const searchProducts = async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;

    try {
        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            };
        }

        const products = await db.product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);
        const totalItems = await db.product.countDocuments(filter);

        return res.status(200).json({
            data: products,
            totalItems
        });
    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.message });
    }
};

// Create Product
const createProduct = async (req, res) => {
    const { name, category, description, buyPrice, commonImages, variants, isFeatured } = req.body;

    console.log(variants);
    // Kiểm tra dữ liệu nhập vào
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    if (!category) {
        return res.status(400).json({ message: "Category is required" });
    }
    if (!buyPrice) {
        return res.status(400).json({ message: "buyPrice is required" });
    }
    // Kiểm tra variants
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
        return res.status(400).json({ message: "Variants are required and must be an array" });
    }

    for (const variant of variants) {
        if (!variant.color) {
            return res.status(400).json({ message: "Color is required for each variant" });
        }
        if (!variant.sizes || !Array.isArray(variant.sizes) || variant.sizes.length === 0) {
            return res.status(400).json({ message: "Sizes are required for each variant and must be an array" });
        }
        if (!variant.imageUrl || !Array.isArray(variant.imageUrl) || variant.imageUrl.length === 0) {
            return res.status(400).json({ message: "imageUrl is required for each variant and must be an array" });
        }
    }
    // Tính toán promotionPrice
    const promotionPrice = buyPrice ? buyPrice * 0.9 : 0; // Giả sử giảm giá 10%

    // Nếu mọi thứ đều ổn
    try {
        let newProduct = {
            name,
            category,
            description,
            buyPrice,
            promotionPrice,
            commonImages,
            variants,
            isFeatured: !!isFeatured // Convert to boolean, if undefined it will be false
        };
        const createdProduct = await db.product.create(newProduct);
        return res.status(201).json({
            message: "Tạo sản phẩm thành công!",
            data: createdProduct
        });
    } catch (error) {
        return res.status(500).json({
            message: "Có lỗi khi tạo sản phẩm",
            error: error.message
        });
    }
};


function combineVariants(existingProduct, newVariants) {
    let combinedVariants = existingProduct.variants.map(variant => ({ ...variant.toObject() }));

    for (const newVariant of newVariants) {
        const existingVariantIndex = combinedVariants.findIndex(v => v.color === newVariant.color);

        if (existingVariantIndex !== -1) {
            // Cập nhật biến thể hiện có với thông tin từ biến thể mới
            let existingVariant = combinedVariants[existingVariantIndex];

            // Cập nhật sizes
            for (const newSize of newVariant.sizes) {
                const sizeIndex = existingVariant.sizes.findIndex(s => s.size === newSize.size);
                if (sizeIndex !== -1) {
                    // Cập nhật số lượng cho size hiện có
                    existingVariant.sizes[sizeIndex].amount = newSize.amount; // Hoặc logic cập nhật khác
                } else {
                    // Thêm size mới vào biến thể hiện có
                    existingVariant.sizes.push(newSize);
                }
            }

            combinedVariants[existingVariantIndex] = existingVariant;
        } else {
            // Biến thể mới với màu sắc mới, thêm vào danh sách
            combinedVariants.push(newVariant);
        }
    }

    return combinedVariants;
}


// Update Product
const updateProductById = async (req, res) => {
    const { productId } = req.params;
    const { name, category, description, buyPrice, commonImages, variants, isFeatured } = req.body;

    // Kiểm tra dữ liệu nhập vào
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    if (!category) {
        return res.status(400).json({ message: "Category is required" });
    }
    if (!buyPrice) {
        return res.status(400).json({ message: "buyPrice is required" });
    }
    // Kiểm tra variants
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
        return res.status(400).json({ message: "Variants are required and must be an array" });
    }

    for (const variant of variants) {
        if (!variant.color) {
            return res.status(400).json({ message: "Color is required for each variant" });
        }
        if (!variant.sizes || !Array.isArray(variant.sizes) || variant.sizes.length === 0) {
            return res.status(400).json({ message: "Sizes are required for each variant and must be an array" });
        }
        if (!variant.imageUrl || !Array.isArray(variant.imageUrl) || variant.imageUrl.length === 0) {
            return res.status(400).json({ message: "imageUrl is required for each variant and must be an array" });
        }
    }

    try {
        const existingProduct = await db.product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }

        // Tính toán promotionPrice dựa trên buyPrice
        const promotionPrice = buyPrice ? buyPrice * 0.9 : existingProduct.promotionPrice;

        let updateData = {
            name,
            category,
            description,
            buyPrice,
            promotionPrice,
            commonImages,
            variants,
            isFeatured
        };

        // Cập nhật sản phẩm
        const updatedProduct = await db.product.findByIdAndUpdate(productId, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating product",
            error: error.message
        });
    }
};

const createOrUpdateProduct = async (req, res) => {
    const { name, variants } = req.body;

    try {
        const existingProduct = await db.product.findOne({ name });

        if (existingProduct) {
            // Gọi hàm updateProduct để cập nhật sản phẩm
            return updateProductById(req, res, existingProduct);
        } else {
            // Gọi hàm createProduct để tạo sản phẩm mới
            return createProduct(req, res);
        }
    } catch (error) {
        return res.status(500).json({
            message: "Có lỗi khi xử lý sản phẩm",
            error: error.message
        });
    }
};

// Find Product by ID
const getProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await db.product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: "Có lỗi khi tìm sản phẩm",
            error: error.message
        });
    }
};

// Hàm xóa ảnh commonImages của sản phẩm
const deleteCommonImages = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await db.product.findById(productId);

        // Lấy danh sách các ảnh cần xóa
        const imagesToDelete = req.body.imagesToDelete || [];

        // Lọc ra các ảnh cần giữ lại
        const remainingImages = product.commonImages.filter(image => !imagesToDelete.includes(image));

        // Cập nhật danh sách ảnh commonImages của sản phẩm
        product.commonImages = remainingImages;

        // Lưu sản phẩm sau khi xóa ảnh
        await product.save();

        return res.status(200).json({
            message: "Common images deleted successfully",
            data: product.commonImages
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting common images",
            error: error.message
        });
    }
};

// Hàm xóa ảnh variants của sản phẩm
const deleteVariantImages = async (req, res) => {
    const { productId } = req.params;
    const { variantSlug } = req.params;

    try {
        const product = await db.product.findById(productId);

        // Lấy danh sách các ảnh cần xóa
        const imagesToDelete = req.body.imagesToDelete || [];

        // Tìm biến thể cần xóa ảnh
        const variant = product.variants.find(v => v.slug === variantSlug);

        if (!variant) {
            return res.status(404).json({
                message: "Variant not found"
            });
        }

        // Lọc ra các ảnh cần giữ lại
        const remainingImages = variant.imageUrl.filter(image => !imagesToDelete.includes(image));

        // Cập nhật danh sách ảnh của biến thể
        variant.imageUrl = remainingImages;

        // Lưu sản phẩm sau khi xóa ảnh
        await product.save();

        return res.status(200).json({
            message: "Variant images deleted successfully",
            data: variant.imageUrl
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting variant images",
            error: error.message
        });
    }
};

// Hàm xóa biến thể của sản phẩm
const deleteVariant = async (req, res) => {
    const { productId } = req.params;
    const { variantSlug } = req.params;

    try {
        const product = await db.product.findById(productId);

        // Tìm biến thể cần xóa
        const variantIndex = product.variants.findIndex(v => v.slug === variantSlug);

        if (variantIndex === -1) {
            return res.status(404).json({
                message: "Variant not found"
            });
        }

        // Xóa biến thể khỏi danh sách
        product.variants.splice(variantIndex, 1);

        // Lưu sản phẩm sau khi xóa biến thể
        await product.save();

        return res.status(200).json({
            message: "Variant deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting variant",
            error: error.message
        });
    }
};

// Delete Product
const deleteProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedProduct = await db.product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
        }
        return res.status(200).json({
            message: "Sản phẩm được xóa thành công!"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Có lỗi khi xóa sản phẩm!",
            error: error.message
        });
    }
};

module.exports = {
    getAllProducts,
    getAllProductsList,
    checkProductExists,
    getRelatedProductsById,
    getFeaturedProducts,
    getProductsByCategory,
    searchProducts,
    createProduct,
    createOrUpdateProduct,
    updateProductById,
    getProductById,
    deleteCommonImages,
    deleteVariantImages,
    deleteVariant,
    deleteProductById
};
