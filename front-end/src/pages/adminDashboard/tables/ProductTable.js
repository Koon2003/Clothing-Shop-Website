import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    Pagination,
    Box,
    Typography,
    IconButton,
    DialogContentText,
    DialogTitle,
    DialogContent,
    Dialog,
    DialogActions,
    Menu
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "./css/ProductTable.css";
import ImageCarousel from "../../../components/common/utilities/ImageCarousel";
import { deleteProduct, fetchProducts } from "../../../redux/actions/productActions";
import { fetchCategories } from "../../../redux/actions/categoryActions";
import AddProductModal from "../../../components/common/utilities/modal/productModals/AddProductModal";
import EditProductModal from "../../../components/common/utilities/modal/productModals/EditProductModal";

const ProductTable = () => {
    const dispatch = useDispatch();
    const { items: products, loading, error } = useSelector(state => state.products);
    const categories = useSelector((state) => state.category.categories);
    const [selectedProductId, setSelectedProductId] = useState(null);

    // Thêm state cho việc mở rộng hàng
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Thêm state cho việc mở modal
    const [showModal, setShowModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    // State quản lý đóng mở globalSnackbar
    const [globalSnackbarOpen, setGlobalSnackbarOpen] = useState(false);
    const [globalSnackbarMessage, setGlobalSnackbarMessage] = useState('');
    const [globalSnackbarSeverity, setGlobalSnackbarSeverity] = useState('info');

    // Thêm state cho việc xác nhận xóa
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    // Thêm state cho việc sắp xếp
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    // Thêm state cho từ khóa lọc
    const [filterInput, setFilterInput] = useState('');

    // Thêm state cho danh mục được chọn
    const [selectedCategory, setSelectedCategory] = useState('');

    // Thêm state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        dispatch(fetchProducts(currentPage, 10));
        dispatch(fetchCategories());
    }, [dispatch, currentPage]);

    // Hàm xử lý thay đổi input lọc
    const handleFilterInputChange = (e) => {
        setFilterInput(e.target.value);
        dispatch(fetchProducts(1, 10, { name: e.target.value, category: selectedCategory }));
    };

    // Hàm xử lý thay đổi danh mục
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        dispatch(fetchProducts(1, 10, { name: filterInput, category: e.target.value }));
    };

    // Hàm để thay đổi trang
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Khi nhận dữ liệu từ API, cập nhật tổng số trang
    useEffect(() => {
        if (products && products.totalPages) {
            setTotalPages(products.totalPages);
        }
    }, [products]);

    const openGlobalSnackbar = (message, severity) => {
        setGlobalSnackbarMessage(message);
        setGlobalSnackbarSeverity(severity);
        setGlobalSnackbarOpen(true);
    };

    // Hàm sắp xếp sản phẩm
    const sortedProducts = useMemo(() => {
        let sortableProducts = products.data ? [...products.data] : [];
        if(sortConfig.key !== null) {
            sortableProducts.sort((a, b) => {
                if(a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableProducts;
    }, [products.data, sortConfig]);

    // Hàm hiển thị mũi tên
    const getSortDirectionArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
        }
        return '';
    };

    // Hàm để thay đổi cấu hình sắp xếp
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Hàm lọc sản phẩm
    const filteredProducts = useMemo(() => {
        return sortedProducts.filter((product) => 
            product.name.toLowerCase().includes(filterInput.toLowerCase()) &&
            (selectedCategory === '' || product.category === selectedCategory)
        );
    }, [sortedProducts, filterInput, selectedCategory]);

    // Thêm điều kiện kiểm tra trước khi render dropdown
    const renderCategoryOptions = () => {
        if (categories && categories.data) {
            return categories.data.map((category) => (
                <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
            ));
        }
        return <MenuItem value="">Đang tải danh mục...</MenuItem>;
    };

    // Hàm xử lý sự kiện khi click vào nút tạo sản phẩm
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Hàm xử lý sự kiện khi click vào hàng để mở rộng
    const toggleExpandRow = (productId) => {
        const newExpandedRows = new Set(expandedRows);
        if (expandedRows.has(productId)) {
            newExpandedRows.delete(productId);
        } else {
            newExpandedRows.add(productId);
        }
        setExpandedRows(newExpandedRows);
    };

    const handleEdit = id => {
        setEditModal(true);
        setSelectedProductId(id); // Đặt ID sản phẩm được chọn khi nhấn nút "Sửa"
    };


    const renderCommonImages = (commonImages) => {
        if (Array.isArray(commonImages) && commonImages.length > 0) {
            return <ImageCarousel images={commonImages} />;
        } else if (commonImages) {
            // For single image URL
            return <img src={commonImages} alt="Product" style={{ maxWidth: '100px', maxHeight: '100px' }} />;
        }
        return <p>No common images available.</p>;
    };

    // Hàm xử lý sự kiện khi click vào confirm trên Modal xóa
    const handleDeleteConfirmOpen = (id) => {
        setSelectedProductId(id);
        setDeleteConfirmOpen(true);
    };

    // Hàm xử lý sự kiện khi click vào cancel trên Modal xóa
    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };

    const handleDelete = async id => {
        try {
            await dispatch(deleteProduct(id))
            openGlobalSnackbar('Sản phẩm được xóa thành công', 'success');
            dispatch(fetchProducts());
        } catch (error) {
            openGlobalSnackbar('Lỗi khi xóa sản phẩm', 'error');
        } finally {
            handleDeleteConfirmClose();
        }
    };

    // Các style dùng chung cho các component
    const tableHeaderStyles = { fontWeight: 'bold', fontSize: '1.2em', fontFamily: 'SFUFuturaBookOblique' };

    const tableRowStyles = { fontFamily: 'SFUFuturaBookOblique', fontSize: '1em' };

    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };

    console.log(selectedCategory);

    return (
        <Box>
            <Box display="flex" justifyContent="center" marginBottom={2} marginTop={5}>
                <Typography variant="h4" component="div" sx={{ fontFamily: 'SFUFuturaBookOblique' }}>
                    DANH SÁCH SẢN PHẨM
                </Typography>
            </Box>

            {loading && <p>Loading...</p>}

            <Box mb={2} display="flex" gap={2}>
                <TextField 
                    label="Tìm kiếm sản phẩm..."
                    variant="outlined"
                    value={filterInput}
                    onChange={handleFilterInputChange}
                />
                <Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    displayEmpty
                >
                    <MenuItem value=""><em>Lọc Theo Loại Sản Phẩm</em></MenuItem>
                    {renderCategoryOptions()}
                </Select>
            </Box>

            <Pagination 
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => handlePageChange(page)}
                color="primary"
            />

            <TableContainer component={Paper}>
                <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenModal}
                        sx={buttonStyle}
                    >
                        Tạo Sản Phẩm
                    </Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                onClick={() => requestSort('name')}
                                sx={tableHeaderStyles}
                                align="center"
                            >
                                Tên Sản Phẩm{getSortDirectionArrow('name')}
                            </TableCell>
                            <TableCell
                                onClick={() => requestSort('category')}
                                sx={tableHeaderStyles}
                                align='center'
                            >
                                Loại Sản Phẩm{getSortDirectionArrow('category')}
                            </TableCell>
                            <TableCell sx={tableHeaderStyles} align="center">Ảnh Sản Phẩm</TableCell>
                            <TableCell sx={tableHeaderStyles} align="center">Mô Tả Sản Phẩm</TableCell>
                            <TableCell
                                onClick={() => requestSort('buyPrice')}
                                sx={tableHeaderStyles}
                                align='center'
                            >
                                Giá Gốc{getSortDirectionArrow('buyPrice')}
                            </TableCell>
                            <TableCell sx={tableHeaderStyles} align="center">Giá Khuyến Mãi/Giá Bán</TableCell>
                            <TableCell
                                onClick={() => requestSort('isFeatured')}
                                sx={tableHeaderStyles}
                                align='center'
                            >
                                Sản Phẩm Nổi Bật{getSortDirectionArrow('isFeatured')}
                            </TableCell>
                            <TableCell sx={tableHeaderStyles} align="center">Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts && filteredProducts.map((product) => (
                            <React.Fragment key={product._id}>
                                <TableRow onClick={() => toggleExpandRow(product._id)}>
                                    <TableCell sx={tableRowStyles} align="center">{product.name}</TableCell>
                                    <TableCell sx={tableRowStyles} align="center">{product.category}</TableCell>
                                    <TableCell sx={tableRowStyles} align="center">{renderCommonImages(product.commonImages)}</TableCell>
                                    <TableCell sx={tableRowStyles} align="center">{product.description}</TableCell>
                                    <TableCell sx={tableRowStyles} align="center">{product.buyPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                    <TableCell sx={tableRowStyles} align="center">{product.promotionPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                    <TableCell sx={tableRowStyles} align="center">{product.isFeatured ? 'Yes' : 'No'}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={(event) => {
                                            event.stopPropagation();
                                            handleEdit(product._id);
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={(event) => {
                                            event.stopPropagation();
                                            handleDeleteConfirmOpen(product._id);
                                        }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                {expandedRows.has(product._id) && (
                                    <TableRow>
                                        <TableCell colSpan="8">
                                            {product.variants.map((variant, variantIndex) => (
                                                <div key={variantIndex} className="variant-details">
                                                    <h3>Color: {variant.color}</h3>
                                                    {variant.imageUrl && variant.imageUrl.length > 0 ? (
                                                        <ImageCarousel images={variant.imageUrl}/>
                                                    ) : (
                                                        <p>Không có ảnh biến thể nào cho sản phẩm này.</p>
                                                    )}
                                                    <div>
                                                        <strong>Kích Cỡ:</strong>
                                                        <ul>
                                                            {variant.sizes.map((size, sizeindex) => (
                                                                <li key={sizeindex}>{size.size} - {size.amount} {size.isInStock ? '(In Stock)' : '(Out of Stock)'}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteConfirmClose}
            >
                <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
                <DialogContent>
                    <DialogContentText>Bạn có chắc chắn muốn xóa danh mục này không?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button sx={buttonStyle} onClick={handleDeleteConfirmClose} color="primary">Hủy</Button>
                    <Button sx={buttonStyle} onClick={() => handleDelete(selectedProductId)} color="secondary">Xóa</Button>
                </DialogActions>
            </Dialog>

            <Box mt={2}>
                <Pagination 
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => handlePageChange(page)}
                    color="primary"
                />
            </Box>

            <Snackbar
                open={globalSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setGlobalSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert elevation={6} variant="filled" severity={globalSnackbarSeverity}>
                    {globalSnackbarMessage}
                </Alert>
            </Snackbar>

            {/* Modals */}
            {showModal && (
                <AddProductModal 
                    open={showModal}
                    handleClose={handleCloseModal}
                    openGlobalSnackbar={openGlobalSnackbar}
                />
            )}
            {
                editModal && (
                    <EditProductModal
                        open={editModal}
                        handleClose={() => {
                            setSelectedProductId(null);
                            setEditModal(false);
                         }}
                        productData={products.data.find(product => product._id === selectedProductId)}
                        openGlobalSnackbar={openGlobalSnackbar}
                    />
                )
            }
        </Box>
    );
};

export default ProductTable;