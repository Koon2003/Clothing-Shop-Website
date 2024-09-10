import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography, Button, IconButton, Paper, Container,
    TextField, InputAdornment, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
}
    from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../../components/common/header/PageHeader';

const CartPage = () => {
    // Các state cho giỏ hàng
    const [cartItems, setCartItems] = useState([]);

    // Các state cho snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');


    const navigate = useNavigate(); // Hook để điều hướng

    // Đọc dữ liệu giỏ hàng từ localStorage
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    // Hàm cập nhật giỏ hàng
    const handleQuantityChange = (index, delta) => {
        const updatedItems = [...cartItems];
        const newQuantity = updatedItems[index].quantity + delta;
        if (newQuantity > 0) {
            updatedItems[index].quantity = newQuantity;
        } else {
            updatedItems.splice(index, 1); // Xóa sản phẩm nếu số lượng là 0
        }
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    };

    // Hàm xóa 1 sản phẩm khỏi giỏ hàng
    const handleRemoveItem = (index) => {
        const updatedItems = [...cartItems];
        updatedItems.splice(index, 1);
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    };





    // Tính tổng số lượng sản phẩm
    const calculateTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Tính tổng giá trị đơn hàng
    const calculateSubtotal = useCallback(() => {
        return cartItems.reduce((total, item) => total + (item.quantity * item.product.promotionPrice), 0);
    }, [cartItems]);

    // Tính toán
    const totalQuantity = calculateTotalItems(); // Tính tổng số lượng sản phẩm
    const totalPrice = calculateSubtotal(); // Tính tổng giá trị đơn hàng

    // Hàm đóng snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // CSS
    const tableCellStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.2rem' };

    // Hàm điều hướng đến trang thanh toán
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            // Nếu giỏ hàng rỗng thì hiển thị snackbar
            setSnackbarMessage('Giỏ hàng của bạn đang trống!');
            setSnackbarOpen(true);
        } else {
            navigate('/checkout');
        }
    };

    // Hàm điều hướng về trang chủ
    const handleContinueShopping = () => {
        navigate('/');
    };


    return (
        <>
            <Container maxWidth="auto" sx={{ mx: 'auto', overflow: 'hidden' }}>
                <PageHeader />
                <Container maxWidth="auto" sx={{ py: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ paddingTop: '20px', fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', paddingBottom: '20px' }} align='center'>GIỎ HÀNG</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="cart table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={tableCellStyle}>Ảnh sản phẩm</TableCell>
                                    <TableCell align="center" sx={tableCellStyle}>Tên sản phẩm</TableCell>
                                    <TableCell align="center" sx={tableCellStyle}>Giá niêm yết</TableCell>
                                    <TableCell align="center" sx={tableCellStyle}>Giá khuyến mãi</TableCell>
                                    <TableCell align="center" sx={tableCellStyle}>Số lượng</TableCell>
                                    <TableCell align="center" sx={tableCellStyle}>Tổng cộng</TableCell>
                                    <TableCell align="center" sx={tableCellStyle}>Xóa</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align='center'>
                                            <img src={item.product.image} alt={item.product.name} style={{ width: '80px' }} />
                                        </TableCell>
                                        <TableCell align='center'>{item.product.name}</TableCell>
                                        <TableCell align="center">
                                            <Typography sx={{ textDecoration: 'line-through' }}>
                                                {item.product.buyPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography color="error">
                                                {item.product.promotionPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ padding: '6px', width: '20px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton onClick={() => handleQuantityChange(index, -1)} size="small">
                                                    <RemoveIcon />
                                                </IconButton>
                                                <TextField
                                                    size="small"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) - item.quantity)}
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end">sl</InputAdornment>,
                                                        style: { width: '6em' }
                                                    }}
                                                />
                                                <IconButton onClick={() => handleQuantityChange(index, 1)} size="small">
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            {(item.quantity * item.product.promotionPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </TableCell>
                                        <TableCell align='center'>
                                            <IconButton onClick={() => handleRemoveItem(index)} size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pr: 75 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.3rem' }}>
                            Tổng số lượng sản phẩm: {totalQuantity}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pr: 15 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.3rem' }}>
                            Tổng cộng: {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleCheckout} sx={{ mt: 2, backgroundColor: 'black', color: 'white', fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.5rem', marginRight: 1 }}>Thanh toán</Button>
                        <Button onClick={handleContinueShopping} sx={{ mt: 2, backgroundColor: 'white', color: 'black', fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.2rem' }}>Tiếp tục Mua sắm</Button>
                    </Box>
                </Container>
            </Container>
            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>

    );
};

export default CartPage;
