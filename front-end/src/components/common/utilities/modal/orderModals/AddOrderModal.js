import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, Box, Typography, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../../../../../redux/actions/productActions';
import { createOrder, fetchOrders } from '../../../../../redux/actions/orderActions';
import AddIcon from '@mui/icons-material/Add';
import provincesData from '../../../../../pages/path/to/data.json';
import Autocomplete from '@mui/material/Autocomplete';

// Utility function to validate email format
const validateEmail = (email) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

// Utility function to validate Vietnamese phone number format
const validatePhone = (phone) => {
    return /^(0?)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/.test(phone);
};


const AddOrderModal = ({ open, handleClose, openGlobalSnackbar }) => {
    // Dispatch action
    const dispatch = useDispatch();

    // Get products and provinces data from redux store
    const products = useSelector(state => state.products.items);

    // Local state
    // Local state for selected city, district, ward
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [orderData, setOrderData] = useState({
        products: [
            {
                product: { _id: '' },
                color: '', // Add color field
                size: '',  // Add size field
                quantity: 1,
            },
        ],
        totalQuantity: 0,
        cost: 0,
        customer: {
            fullName: '',
            phone: '',
            email: '',
            address: '',
            city: '',
            district: '',
            ward: '',
            country: 'Việt Nam',
        },
    });

    // Fetch products and provinces data
    useEffect(() => {
        if (!products.length) {
            dispatch(fetchAllProducts());
        }
    }, [dispatch, products.length]);

    // Update total quantity and total cost when products change
    useEffect(() => {
        updateTotals(orderData.products);
    }, [orderData.products]); // Dependence on orderData.products

    // Update total quantity and total cost when customer changes
    const updateTotals = (updatedProducts) => {
        const totalQuantity = updatedProducts.reduce((sum, item) => sum + item.quantity, 0);
        const totalCost = updatedProducts.reduce((sum, item) => {
            const cost = item.quantity * (item.product.promotionPrice || 0);
            return sum + cost;
        }, 0);
        setOrderData(prevState => ({
            ...prevState,
            products: updatedProducts,
            totalQuantity,
            totalCost
        }));
    };

    // Handle product selection
    const handleProductChange = (index, value) => {
        const updatedProducts = [...orderData.products];
        const selectedProduct = products.data.find(p => p._id === value);

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (!selectedProduct) {
            console.error("Sản phẩm không tìm thấy");
            return; // Thoát khỏi hàm nếu không tìm thấy sản phẩm
        }

        const productCost = selectedProduct ? selectedProduct.promotionPrice * 1 : 0;
        updatedProducts[index] = {
            ...updatedProducts[index],
            product: selectedProduct || {},
            color: '',
            size: '',
            quantity: 1,
            cost: productCost,
        };
        updateTotals(updatedProducts);
    };


    // Hàm xử lý khi thay đổi các trường color, size, quantity
    const handleVariantChange = (index, field, value) => {
        const updatedProducts = [...orderData.products];
        let updatedValue = value;

        if (field === 'quantity') {
            updatedValue = parseInt(value) || 0; // Default to 0 if NaN
            updatedProducts[index].cost = updatedProducts[index].product.promotionPrice * updatedValue;
        } else {
            updatedProducts[index] = { ...updatedProducts[index], [field]: updatedValue };
        }

        // Kiểm tra nếu variants không có sẵn
        const variantOptions = updatedProducts[index].product.variants || [];
        if (!variantOptions.length && (field === 'color' || field === 'size')) {
            console.error("Không có variants cho sản phẩm này");
            return; // Thoát khỏi hàm nếu không có variants
        }

        updateTotals(updatedProducts);
    };

    // Hàm xử lý khi thêm sản phẩm mới
    const handleAddProduct = () => {
        setOrderData({
            ...orderData,
            products: [...orderData.products, { product: { _id: '', promotionPrice: 0 }, color: '', size: '', quantity: 1, cost: 0 }]
        });
    };

    // Hàm xử lý khi thay đổi các trường thông tin khách hàng
    const handleCustomerChange = (e) => {
        setOrderData({ ...orderData, customer: { ...orderData.customer, [e.target.name]: e.target.value } });
    };



    // Hàm xử lý khi click vào nút Submit
    const handleSubmit = () => {
        // Validate required fields
        const { fullName, phone, email, address, city, district, ward, country } = orderData.customer;
        if (!fullName || !phone || !email || !address || !city || !district || !ward || !country) {
            openGlobalSnackbar("Vui lòng nhập đầy đủ thông tin khách hàng.");
            return;
        }

        // Validate email and phone
        if (!validateEmail(email)) {
            openGlobalSnackbar("Định dạng email không hợp lệ.");
            return;
        }
        if (!validatePhone(phone)) {
            openGlobalSnackbar("Số điện thoại không hợp lệ. Số điện thoại phải là số Việt Nam.");
            return;
        }

        dispatch(createOrder(orderData))
            .then(() => {
                openGlobalSnackbar("Tạo đơn hàng mới thành công.", "success");
                dispatch(fetchOrders());
                handleClose();
            })
            .catch((error) => {
                openGlobalSnackbar(`Lỗi khi tạo đơn hàng: ${error.message}`, "error");
            });
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.5rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };
    const textStyles = { fontFamily: 'SFUFuturaBookOblique', fontSize: '1.3em' };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={headerStyle} align='center'>Tạo Đơn Hàng Mới</DialogTitle>
            <DialogContent>
                <Typography variant="h6" sx={headerStyle}>Chi tiết sản phẩm</Typography>
                {/* Product Section */}
                {orderData.products.map((product, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sản phẩm {index + 1}</Typography>
                        <Select
                            value={product._id}
                            onChange={(e) => handleProductChange(index, e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            <MenuItem disabled value="">
                                <em>Chọn sản phẩm</em>
                            </MenuItem>
                            {products.data && products.data.map((p) => (
                                <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                            ))}
                        </Select>
                        {/* Color and Size Selection */}
                        {product.product._id && product.product.variants && (
                            <>
                                {/* Color */}
                                <Select
                                    value={product.color}
                                    onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                >
                                    <MenuItem disabled value="">
                                        <em>Màu sắc</em>
                                    </MenuItem>
                                    {/* Color options */}
                                    {product.product.variants && product.product.variants.map((variant) => (
                                        <MenuItem key={variant.color} value={variant.color}>{variant.color}</MenuItem>
                                    ))}
                                </Select>
                                {/* Size */}
                                <Select
                                    value={product.size}
                                    onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                    displayEmpty
                                    fullWidth
                                >
                                    <MenuItem disabled value="">
                                        <em>Kích thước</em>
                                    </MenuItem>
                                    {/* Size options */}
                                    {product.product.variants && product.product.variants.find(v => v.color === product.color)?.sizes.map((sizeObj) => (
                                        <MenuItem key={sizeObj.size} value={sizeObj.size}>{sizeObj.size}</MenuItem>
                                    ))}
                                </Select>
                                {/* Quantity Input */}
                                <TextField
                                    type="number"
                                    label="Số lượng"
                                    value={product.quantity}
                                    onChange={(e) => handleVariantChange(index, 'quantity', parseInt(e.target.value))}
                                    fullWidth
                                />
                                <Box>
                                    Giá sản phẩm: {product.cost.toLocaleString()} VND
                                </Box>
                            </>
                        )}
                    </Box>
                ))}
                <Button onClick={handleAddProduct} sx={{ marginTop: 2 }}><AddIcon /></Button>
                {/* Display Total Quantity and Total Order Cost */}
                <Box sx={textStyles}>
                    Tổng số lượng: {orderData.totalQuantity}
                </Box>
                <Box sx={textStyles}>
                    Tổng giá: {orderData.totalCost} VND
                </Box>
                <Typography variant="h6" sx={headerStyle}>Thông tin khách hàng</Typography>
                {/* Các trường thông tin khách hàng */}
                <Box sx={{ my: 2 }}>
                    <TextField
                        label="Họ và tên"
                        name="fullName"
                        value={orderData.customer.fullName}
                        onChange={handleCustomerChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Số điện thoại"
                        name="phone"
                        value={orderData.customer.phone}
                        onChange={handleCustomerChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={orderData.customer.email}
                        onChange={handleCustomerChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Địa chỉ"
                        name="address"
                        value={orderData.customer.address}
                        onChange={handleCustomerChange}
                        fullWidth
                        margin="normal"
                    />
                    {/* Select for City, District, and Ward */}
                    <Autocomplete
                        value={selectedProvince}
                        onChange={(event, newValue) => {
                            setSelectedProvince(newValue);
                            setSelectedDistrict(null);
                            setSelectedWard(null);
                            setOrderData(prev => ({
                                ...prev,
                                customer: {
                                    ...prev.customer,
                                    city: newValue?.name || '',
                                    district: '',
                                    ward: ''
                                }
                            }));
                        }}
                        options={provincesData}
                        getOptionLabel={(option) => option.name || ''}
                        renderInput={(params) => <TextField {...params} label="Tỉnh/Thành phố" margin="normal" />}
                    />

                    <Autocomplete
                        value={selectedDistrict}
                        onChange={(event, newValue) => {
                            setSelectedDistrict(newValue);
                            setSelectedWard(null);
                            setOrderData(prev => ({
                                ...prev,
                                customer: {
                                    ...prev.customer,
                                    district: newValue?.name || '',
                                    ward: ''
                                }
                            }));
                        }}
                        options={selectedProvince?.districts || []}
                        getOptionLabel={(option) => option.name || ''}
                        renderInput={(params) => <TextField {...params} label="Quận/Huyện" margin="normal" />}
                        disabled={!selectedProvince}
                    />

                    <Autocomplete
                        value={selectedWard}
                        onChange={(event, newValue) => {
                            setSelectedWard(newValue);
                            setOrderData(prev => ({
                                ...prev,
                                customer: {
                                    ...prev.customer,
                                    ward: newValue?.name || ''
                                }
                            }));
                        }}
                        options={selectedDistrict?.wards || []}
                        getOptionLabel={(option) => option.name || ''}
                        renderInput={(params) => <TextField {...params} label="Phường/Xã" margin="normal" />}
                        disabled={!selectedDistrict}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">Hủy</Button>
                <Button onClick={handleSubmit} variant="contained" sx={buttonStyle}>Tạo Đơn Hàng</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddOrderModal;
