import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { fetchOrders, updateOrder } from '../../../../../redux/actions/orderActions';
import { fetchAllProducts } from '../../../../../redux/actions/productActions';

const EditOrderModal = ({ open, handleClose, order, openGlobalSnackbar }) => {
    const dispatch = useDispatch();
    // Local state
    const [orderData, setOrderData] = useState(order);
    // Get products data from redux store   
    const products = useSelector(state => state.products.items);

    // Fetch products data
    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    // Set initial order data
    useEffect(() => {
        setOrderData(order);
    }, [order]);

    // Hàm xử lý khi thay đổi input
    const handleChange = (e, field) => {
        setOrderData({ ...orderData, [field]: e.target.value });
    };

    // Hàm xử lý khi thay đổi sản phẩm
    const handleProductChange = (e, index, field) => {
        const updatedProducts = [...orderData.products];
        const selectedProductId = e.target.value;

        // Cập nhật sản phẩm mới
        if (field === 'product') {
            const productInfo = getProductDetails(selectedProductId);
            updatedProducts[index] = {
                ...updatedProducts[index],
                product: productInfo,
                color: productInfo?.variants?.[0]?.color || '',
                size: productInfo?.variants?.[0]?.sizes?.[0]?.size || ''
            };
        } else {
            updatedProducts[index] = { ...updatedProducts[index], [field]: e.target.value };
        }
        // Cập nhật lại state
        setOrderData({ ...orderData, products: updatedProducts });
    };

    // Tìm kiếm sản phẩm theo id
    const getProductDetails = (productId) => {
        return Array.isArray(products.data) ? products.data.find(product => product._id === productId) : null;
    };

    // Hàm xử lý khi thêm sản phẩm mới
    const handleAddProduct = () => {
        setOrderData({
            ...orderData,
            products: [...orderData.products, {
                product: '', // Khởi tạo một sản phẩm rỗng
                color: '', // Khởi tạo màu rỗng
                size: '', // Khởi tạo kích thước rỗng
                quantity: 1,
                isNew: true
            }]
        });
    };

    // Hàm xử lý khi xóa sản phẩm
    const updateTotalQuantity = () => {
        const newTotalQuantity = orderData.products.reduce((total, product) => total + product.quantity, 0);
        setOrderData({ ...orderData, totalQuantity: newTotalQuantity });
    };

    // Hàm xử lý khi thay đổi số lượng sản phẩm
    const handleQuantityChange = (index, delta) => {
        const updatedProducts = [...orderData.products];
        const newQuantity = updatedProducts[index].quantity + delta;
        if (newQuantity >= 0) {
            updatedProducts[index].quantity = newQuantity;
            setOrderData({ ...orderData, products: updatedProducts });
            updateTotalQuantity();
        }
    };

    // Tạo hàm để tính tổng giá của từng sản phẩm
    const calculateProductTotal = (product) => {
        const productDetails = getProductDetails(product.product._id);
        if (productDetails) {
            return product.quantity * (productDetails.promotionPrice || 0);
        }
        return 0;
    };

    // Tạo hàm để tính tổng giá của toàn bộ đơn hàng
    const calculateOrderTotal = () => {
        let total = 0;
        orderData.products.forEach((product) => {
            const productTotal = calculateProductTotal(product);
            total += productTotal;
        });
        return total;
    };

    // Hàm kiểm tra form hợp lệ
    const handleSave = () => {
        dispatch(updateOrder(order._id, orderData))
            .then(() => {
                // If update is successful
                openGlobalSnackbar('Cập nhật đơn hàng thành công', 'success');
                handleClose();
                dispatch(fetchOrders());
            })
            .catch((error) => {
                // If there is an error
                openGlobalSnackbar(`Lỗi khi cập nhật đơn hàng: ${error.message}`, 'error');
            });
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };
    const textStyles = { fontFamily: 'SFUFuturaBookOblique', fontSize: '1.3em' };

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '500px', // Cho phép Modal thay đổi kích thước
                    maxHeight: '90vh', // Giới hạn chiều cao của Modal
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    overflowY: 'auto', // Cho phép cuộn khi Modal quá cao
                }}
            >
                <Typography variant="h6" component="h2" sx={headerStyle} align='center'>
                    Chỉnh Sửa Đơn Hàng
                    <IconButton onClick={handleClose} sx={{ float: 'right' }}>
                        <CloseIcon />
                    </IconButton>
                </Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <Typography sx={{ ...textStyles, mb: 1 }}>
                        Ngày đặt hàng: {new Date(orderData.orderDate).toLocaleDateString()}
                    </Typography>
                    <Typography sx={{ ...textStyles, mb: 1 }}>
                        Tổng số lượng: {orderData.totalQuantity}
                    </Typography>
                    <Typography sx={{ ...textStyles, mb: 5 }}>
                        Tổng giá đơn hàng: {calculateOrderTotal()} VNĐ
                    </Typography>
                    {orderData.products.map((product, index) => {
                        const productDetails = getProductDetails(product.product._id);
                        const productTotal = calculateProductTotal(product);
                        const selectedProductId = product.product?._id || '';

                        return (
                            <Box key={index} sx={{ mb: 2 }}>
                                <FormControl fullWidth sx={{ mb: 1 }}>
                                    <InputLabel>Sản Phẩm</InputLabel>
                                    <Select
                                        value={selectedProductId}
                                        label="Product"
                                        onChange={(e) => handleProductChange(e, index, 'product')}
                                    >
                                        {Array.isArray(products.data) && products.data.map((p) => (
                                            <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 1 }}>
                                    <InputLabel>Màu Sắc</InputLabel>
                                    <Select
                                        value={product.color}
                                        label="Color"
                                        onChange={(e) => handleProductChange(e, index, 'color')}
                                        disabled={!product.product}
                                    >
                                        {productDetails?.variants?.map((variant) => (
                                            <MenuItem key={variant.color} value={variant.color}>{variant.color}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ mb: 1 }}>
                                    <InputLabel>Kích Cỡ</InputLabel>
                                    <Select
                                        value={product.size}
                                        label="Size"
                                        onChange={(e) => handleProductChange(e, index, 'size')}
                                        disabled={!product.product}
                                    >
                                        {productDetails?.variants?.find(v => v.color === product.color)?.sizes?.map((size) => (
                                            <MenuItem key={size.size} value={size.size}>{size.size}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                                    <Button onClick={() => handleQuantityChange(index, -1)}>-</Button>
                                    <Typography sx={{ ...textStyles, mx: 2 }}>
                                        Số lượng: {product.quantity}
                                    </Typography>
                                    <Button onClick={() => handleQuantityChange(index, 1)}>+</Button>
                                </Box>
                                <Typography sx={{...textStyles, mb: 5}}>
                                    Tổng giá: {productTotal} VNĐ
                                </Typography>
                            </Box>
                        );
                    })}
                    <Button variant="contained" color="secondary" onClick={handleAddProduct} sx={{ ...buttonStyle, mb: 2 }}>
                        <AddIcon />
                    </Button>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Tình Trạng</InputLabel>
                        <Select
                            value={orderData.status}
                            label="Status"
                            onChange={(e) => handleChange(e, 'status')}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Canceled">Canceled</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleSave} fullWidth sx={buttonStyle}>
                        Lưu
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditOrderModal;
