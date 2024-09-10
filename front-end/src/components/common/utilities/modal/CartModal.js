import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';


const CartModal = ({ onClose }) => {
    // Quản lý trạng thái của giỏ hàng bằng state
    const [cart, setCart] = useState([]);

    // Quản lý trạng thái của giỏ hàng có rỗng hay không
    const [isCartEmpty, setIsCartEmpty] = useState(false);

    // Sử dụng hook để điều hướng đến trang thanh toán
    const navigate = useNavigate();

    // Lấy dữ liệu giỏ hàng từ localStorage
    useEffect(() => {
        // Đọc dữ liệu giỏ hàng từ localStorage khi component được mount
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
    }, []);

    // Hàm tính tổng giá trị đơn hàng
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.quantity * item.product.promotionPrice), 0);
    };

    // Tạo biến để lưu giữ tổng giá trị đơn hàng
    const total = calculateTotal();

    // Hàm xử lý giảm số lượng
    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
        } else {
            // Nếu số lượng là 1, xóa sản phẩm khỏi giỏ hàng
            updatedCart.splice(index, 1);
        }
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Hàm xử lý tăng số lượng
    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity += 1;
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Function to handle deletion of a product from the cart
    const deleteItem = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Hàm xử lý khi click vào nút Xác Nhận
    const handleConfirmModalClick = () => {
        if (cart.length === 0) {
            // Nếu giỏ hàng rỗng, hiển thị thông báo và không navigate
            setIsCartEmpty(true);
        } else {
            // Nếu giỏ hàng có sản phẩm, tiếp tục chuyển hướng đến trang thanh toán
            navigate(`/checkout`);
        }
    };

    // Hàm để đóng thông báo Snackbar
    const handleCloseSnackbar = () => {
        setIsCartEmpty(false);
    };

    return (
        <Paper sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 800, // Adjust the width as necessary
            maxHeight: '80vh',
            overflowY: 'auto',
            fontFamily: 'SFUFuturaBookOblique',
        }}>
            <Typography variant="h4" id="cart-modal-title" align='center' gutterBottom>GIỎ HÀNG</Typography>
            <TableContainer>
                <Table sx={{ border: 0 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.1rem' }}>Sản phẩm</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.1rem' }}>Size</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.1rem' }} align="right">Số lượng</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.1rem' }} align="right">Giá bán</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.1rem' }} align="right">Giá niêm yết</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.1rem' }}>Xóa</TableCell> {/* Delete column header */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.map((item, index) => (
                            <TableRow key={index} sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <TableCell component="th" scope="row">
                                    <Box display="flex" alignItems="center">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            style={{ width: '50px', height: '50px', marginRight: '16px' }}
                                        />
                                        {item.product.name}
                                    </Box>
                                </TableCell>
                                <TableCell align='center'>{item.product.size}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => decreaseQuantity(index)} size="small">
                                        <RemoveIcon />
                                    </IconButton>
                                    {item.quantity}
                                    <IconButton onClick={() => increaseQuantity(index)} size="small">
                                        <AddIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    {item.product.buyPrice.toLocaleString('vi-VN')} VND
                                </TableCell>
                                <TableCell align="center">
                                    {item.product.promotionPrice.toLocaleString('vi-VN')} VND
                                </TableCell>
                                <TableCell> {/* Delete icon cell */}
                                    <IconButton onClick={() => deleteItem(index)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h5">
                    Tộng cộng: {total.toLocaleString('vi-VN')} VND
                </Typography>
                <Button variant="contained" sx={{ backgroundColor: "black", mt: 1 }} onClick={handleConfirmModalClick}>Xác Nhận</Button>
                <Button variant="contained" sx={{ backgroundColor: "black", marginLeft: 1, mt: 1 }} onClick={onClose}>Tiếp Tục Mua Hàng</Button>
            </Box>
            <Snackbar open={isCartEmpty} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%', color: 'red' }}>
                    Giỏ hàng của bạn đang rỗng!
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default CartModal;
