import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Typography, Button, Stack, Card, Container, CardContent,
    Grid, TextField, Alert, Box, Paper, Snackbar, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { checkVoucher } from '../../redux/actions/voucherActions';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/actions/cartActions';
import emailjs from '@emailjs/browser';
import CheckOutHeader from '../../components/common/header/CheckOutHeader';
import provincesData from '../path/to/data.json';

const CheckOutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Quản lý trạng thái của giỏ hàng bằng state
    const [cart, setCart] = useState([]);

    // State quản lý trạng thái Voucher
    const [voucherCode, setVoucherCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(0);
    const voucherState = useSelector(state => state.voucher); // Selector để lấy trạng thái của voucher từ store

    // State quản lý trạng thái thanh toán
    const [paymentMethod, setPaymentMethod] = useState('');

    // State quản lý kiểm tra Email
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailCheckError, setEmailCheckError] = useState('');
    // State để quản lý lỗi email không đúng định dạng
    const [emailError, setEmailError] = useState('');

    // Thêm state mới để quản lý lỗi số điện thoại
    const [phoneError, setPhoneError] = useState('');

    // States for form fields
    const [customerInfo, setCustomerInfo] = useState({
        email: '',
        fullName: '',
        address: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        country: 'Việt Nam',
    });

    //State quản lý Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Severity: success, error, warning, info

    // Khai báo provinces
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);


    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);
    }, [dispatch]);

    // Hàm Check Email
    const checkEmail = async () => {
        setIsCheckingEmail(true);
        setEmailCheckError('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/customers/email/${customerInfo.email}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (response.ok && data) {
                const customerData = {
                    ...data,
                    city: data.city || '',
                    district: data.district || '',
                    ward: data.ward || '',
                };

                // Find the correct province, district, and ward objects from provincesData
                const province = provincesData.find(p => p.name === customerData.city);
                const district = province?.districts.find(d => d.name === customerData.district);
                const ward = district?.wards.find(w => w.name === customerData.ward);

                // Update the Autocomplete fields
                setSelectedProvince(province || null);
                setSelectedDistrict(district || null);
                setSelectedWard(ward || null);

                setCustomerInfo({
                    ...data,
                    city: data.city || '',
                    district: data.district || '',
                    ward: data.ward || '',
                });
                handleOpenSnackbar('Thông tin khách hàng đã được tải', 'success');
            } else {
                throw new Error('Không tìm thấy thông tin khách hàng với email này. Hãy điền thông tin giao hàng!');
            }
        } catch (error) {
            setEmailCheckError(error.message);
            handleOpenSnackbar(error.message, 'error');
        } finally {
            setIsCheckingEmail(false);
        }
    };
    // Hàm kiểm tra định dạng email
    const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Sửa hàm xử lý sự kiện thay đổi email
    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setCustomerInfo({ ...customerInfo, email: emailValue });

        // Kiểm tra và cập nhật lỗi email
        if (emailValue && !isValidEmail(emailValue)) {
            setEmailError("Email không đúng định dạng.");
        } else {
            setEmailError("");
        }
    };
    // Hàm kiểm tra định dạng số điện thoại
    const isValidPhone = (phone) => {
        const re = /^(0|\+84|0084)[3|5|7|8|9][0-9]{8}$/;
        return re.test(String(phone));
    };

    // Sửa hàm xử lý sự kiện thay đổi số điện thoại
    const handlePhoneChange = async (e) => {
        const phoneValue = e.target.value;
        setCustomerInfo({ ...customerInfo, phone: phoneValue });

        // Kiểm tra và cập nhật lỗi số điện thoại
        if (phoneValue && !isValidPhone(phoneValue)) {
            setPhoneError("Số điện thoại không hợp lệ.");
        } else {
            setPhoneError("");
            // Thực hiện kiểm tra trùng số điện thoại
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/customers/check-phone/${phoneValue}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                });

                const data = await response.json();

                if (response.ok && data.exists) {
                    // Số điện thoại đã tồn tại
                    setPhoneError("Số điện thoại đã được sử dụng bởi khách hàng khác.");
                }
            } catch (error) {
                // Xử lý lỗi (nếu có)
                setPhoneError("Lỗi khi kiểm tra số điện thoại.");
            }
        }
    };



    // Hàm áp dụng Voucher
    const applyVoucher = () => {
        if (voucherCode) {
            dispatch(checkVoucher(voucherCode));
        } else {
            setDiscountApplied(0); // Reset discount nếu không có mã voucher
            handleOpenSnackbar('Voucher reset', 'info');
        }
    };

    // Code quản lý áp dụng voucher
    useEffect(() => {
        if (voucherState.error) {
            handleOpenSnackbar(voucherState.error.message, 'error');
        }
        if (voucherState.success && voucherState.data) {
            const discountPercentage = voucherState.data.data.discount / 100;
            const totalBeforeDiscount = calculateTotalWithoutDiscount();
            setDiscountApplied(totalBeforeDiscount * discountPercentage);
            handleOpenSnackbar('Voucher áp dụng thành công', 'success');
        }
    }, [voucherState.success, voucherState.data, voucherState.error]);

    // Hàm tính tổng đơn hàng khi không có voucher
    const calculateTotalWithoutDiscount = () => {
        const totalWithoutDiscount = cart.reduce((total, item) => total + (item.quantity * item.product.promotionPrice), 0);
        return totalWithoutDiscount;
    };

    // Hàm tính tổng đơn hàng
    const calculateTotal = () => {
        const totalWithoutDiscount = calculateTotalWithoutDiscount();
        const totalAfterDiscount = Math.max(0, totalWithoutDiscount - discountApplied);
        return { total: totalWithoutDiscount, totalAfterDiscount };
    };

    // Tạo biến để lưu giữ tổng giá trị đơn hàng trước và sau khi giảm giá
    const { total, totalAfterDiscount } = calculateTotal();
    // Hàm để mở và đóng Snackbar với thông báo cụ thể
    const handleOpenSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    // Hàm gửi email xác nhận đơn hàng
    const sendEmailConfirmation = (orderDetails, orderId) => {
        // Tạo một chuỗi thông điệp mô tả chi tiết đơn hàng
        let orderItemsString = orderDetails.products.map(item =>
            `Mã sản phẩm: ${item.product}, Màu sắc: ${item.color}, Kích cỡ: ${item.size}, Số lượng: ${item.quantity}, Giá: ${item.promotionPrice}`
        ).join(", "); // Chuyển mảng thành chuỗi, ngăn cách bởi dấu phẩy

        const orderMessage = `Mã Đơn Hàng: ${orderId}\n` +
            `Họ và Tên: ${orderDetails.customerFullName}\n` +
            `Email: ${orderDetails.customerEmail}\n` +
            `Thông Tin Đơn Hàng: ${orderItemsString}\n` +
            `Tổng Số Lượng Sản Phẩm: ${orderDetails.totalQuantity}\n` +
            `Phương Thức Thanh Toán: ${orderDetails.paymentType}\n` +
            `Tổng Đơn Hàng: ${orderDetails.cost}`;

        const templateParams = {
            to_name: orderDetails.customerFullName,
            to_email: orderDetails.customerEmail,
            from_name: 'Tan Boutique',
            message: orderMessage,
            reply_to: 'tanboutique73@gmail.com',
            cc_email: 'tanboutique73@gmail.com'
        };

        emailjs.send(
            process.env.REACT_APP_EMAILJS_SERVICE_ID,
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
            templateParams,
            process.env.REACT_APP_EMAILJS_USER_ID
        )
            .then((response) => {
                handleOpenSnackbar('Email xác nhận đơn hàng được gửi thành công', response.status, response.text);
            }, (error) => {
                handleOpenSnackbar('Lỗi khi gửi email xác nhận đơn hàng', error);
            });
    };


    // Hàm xử lý đặt hàng
    const handlePlaceOrder = async () => {
        const { email, fullName, address, phone, city, district, ward } = customerInfo;

        // Kiểm tra nếu thông tin giao hàng chưa đầy đủ
        if (!email || !fullName || !address || !phone || !city || !district || !ward) {
            if (!paymentMethod) {
                handleOpenSnackbar('Vui lòng điền đầy đủ thông tin và chọn phương thức thanh toán', 'error');
            } else {
                handleOpenSnackbar('Vui lòng điền đầy đủ thông tin giao hàng', 'error');
            }
            return;
        }

        // Kiểm tra nếu chưa chọn phương thức thanh toán
        if (!paymentMethod) {
            handleOpenSnackbar('Vui lòng chọn phương thức thanh toán', 'error');
            return;
        }

        // Kiểm tra số lượng sản phẩm trong giỏ hàng
        for (const item of cart) {
            if (item.product.amount < item.quantity) {
                handleOpenSnackbar(`Không đủ số lượng sản phẩm ${item.product.name} màu ${item.product.color} size ${item.product.size} trong kho`, 'error');
                return;
            }
        }

        try {
            // Check for existing user or create a new one from email
            const userResponse = await fetch(`${process.env.REACT_APP_API_URL}/user/create-from-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });


            if (!userResponse.ok) throw new Error('Có lỗi khi tạo hoặc cập nhật user.');

            // Get user ID
            const userData = await userResponse.json();
            const userId = userData._id;

            // Create or update customer
            const customerResponse = await fetch(`${process.env.REACT_APP_API_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...customerInfo, user: userId })
            });

            // Handle customer creation or update error
            if (!customerResponse.ok) throw new Error('Có lỗi khi tạo hoặc cập nhật khách hàng!');

            // Get customer ID
            const customerData = await customerResponse.json();
            const customerId = customerData.customerId;

            // Create order
            const orderDetails = {
                customer: customerId,
                customerFullName: fullName,
                customerEmail: email,
                products: cart.map(item => ({
                    product: item.product.id,
                    color: item.product.color,
                    size: item.product.size,
                    quantity: item.quantity,
                    promotionPrice: item.product.promotionPrice,
                    amount: item.product.amount,
                })),
                totalQuantity: cart.reduce((total, item) => total + item.quantity, 0),
                cost: totalAfterDiscount,
                paymentType: paymentMethod,
            };

            const orderResponse = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails)
            });

            if (orderResponse.ok) {
                const orderData = await orderResponse.json();
                const orderId = orderData.orderId; // Giả sử orderId được trả về trong phản hồi

                // Gửi email xác nhận
                sendEmailConfirmation(orderDetails, orderId);
                localStorage.removeItem('cart'); // Xóa giỏ hàng khỏi localStorage
                dispatch(clearCart);
                navigate('/thank-you'); // Điều hướng đến trang cảm ơn
            } else {
                throw new Error('Có lỗi khi tạo order.');
            }
            // Handle success
            handleOpenSnackbar('Đơn hàng đã được đặt thành công', 'success');
            // Clear cart and other states as needed
        } catch (error) {
            handleOpenSnackbar(error.message, 'error');
        }
    };

    // CSS
    const tableCellStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '0.8rem' };
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };

    return (
        <Container maxWidth="auto">
            <CheckOutHeader />
            <Typography variant="h4" gutterBottom sx={{ paddingTop: '20px', fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold' }} align='center'>XÁC NHẬN ĐƠN HÀNG</Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 2 }}>
                        {/* Shipping Address Form */}
                        <Card variant="outlined" sx={{ marginBottom: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={headerStyle}>THÔNG TIN GIAO HÀNG</Typography>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    margin="normal"
                                    value={customerInfo.email}
                                    onChange={handleEmailChange}
                                    error={!!emailError}
                                    helperText={emailError}
                                    disabled={isCheckingEmail}
                                />
                                <Button variant="contained" sx={buttonStyle} onClick={checkEmail} disabled={isCheckingEmail}>
                                    Kiểm tra thông tin qua Email
                                </Button>
                                {emailCheckError && <Alert severity="error" sx={{ mt: 2 }}>{emailCheckError}</Alert>}
                                <Box sx={{ mt: 2 }}>
                                    {/* Customer Information Form */}
                                    <TextField
                                        fullWidth
                                        label="Họ và Tên"
                                        margin="normal"
                                        value={customerInfo.fullName}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        margin="normal"
                                        value={customerInfo.phone}
                                        onChange={handlePhoneChange}
                                        error={!!phoneError}
                                        helperText={phoneError}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Địa chỉ"
                                        margin="normal"
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                    />
                                    {/* Select for City, District, and Ward */}
                                    <Autocomplete
                                        value={selectedProvince}
                                        onChange={(event, newValue) => {
                                            setSelectedProvince(newValue);
                                            setSelectedDistrict(null);
                                            setSelectedWard(null);
                                            setCustomerInfo({ ...customerInfo, city: newValue?.name || '', district: '', ward: '' });
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
                                            setCustomerInfo({ ...customerInfo, district: newValue?.name || '', ward: '' });
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
                                            setCustomerInfo({ ...customerInfo, ward: newValue?.name || '' });
                                        }}
                                        options={selectedDistrict?.wards || []}
                                        getOptionLabel={(option) => option.name || ''}
                                        renderInput={(params) => <TextField {...params} label="Phường/Xã" margin="normal" />}
                                        disabled={!selectedDistrict}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                        <Button variant="contained" color="primary" sx={{ mt: 2, backgroundColor: 'white', color: 'black', fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.5rem' }} onClick={handlePlaceOrder}>
                            Đặt hàng
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" align='center' sx={headerStyle}>CHI TIẾT GIỎ HÀNG</Typography>
                        {/* Hiển thị danh sách sản phẩm trong giỏ hàng */}
                        <Stack spacing={2}>
                            <TableContainer>
                                <Table sx={{ border: 0 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={tableCellStyle} align="center">Ảnh Sản Phẩm</TableCell>
                                            <TableCell sx={tableCellStyle} align="center">Tên Sản Phẩm</TableCell>
                                            <TableCell sx={tableCellStyle} align="center">Size</TableCell>
                                            <TableCell sx={tableCellStyle} align="center">Số Lượng</TableCell>
                                            <TableCell sx={tableCellStyle} align="center">Giá Bán</TableCell>
                                            <TableCell sx={tableCellStyle} align="center">Giá Khuyến Mãi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={tableCellStyle} align='center'>
                                                    <img src={item.product.image} alt={item.product.name} style={{ width: '100px', height: 'auto', marginRight: '16px' }} />
                                                </TableCell>
                                                <TableCell sx={tableCellStyle} align='center'>
                                                    {item.product.name}
                                                </TableCell>
                                                <TableCell sx={tableCellStyle} align="center">{item.product.size}</TableCell>
                                                <TableCell sx={tableCellStyle} align="center">{item.quantity}</TableCell>
                                                <TableCell sx={tableCellStyle} align="center">
                                                    {item.product.buyPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </TableCell>
                                                <TableCell sx={tableCellStyle} align="center">
                                                    {item.product.promotionPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <TextField
                                    label="Voucher Code"
                                    variant="outlined"
                                    size="small"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                />
                                <Button variant="contained" sx={buttonStyle} onClick={applyVoucher}>Áp dụng Voucher</Button>
                            </Stack>
                            {voucherState.error && (
                                <Alert severity="error">
                                    {voucherState.error.message}
                                </Alert>
                            )}
                            {/* Payment method options */}
                            <Typography variant="h6" align='center' sx={{ ...headerStyle, paddingBottom: '10px' }}>PHƯƠNG THỨC THANH TOÁN</Typography>
                            <Box>
                                <label>
                                    <input
                                        type="radio"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                    />
                                    Thanh toán khi nhận hàng
                                </label>
                                <br />
                                <label>
                                    <input
                                        type="radio"
                                        value="BankTransfer"
                                        checked={paymentMethod === 'BankTransfer'}
                                        onChange={() => setPaymentMethod('BankTransfer')}
                                    />
                                    Chuyển khoản ngân hàng
                                </label>
                            </Box>
                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                {/* Hiển thị tổng giá trị đơn hàng trước khi giảm giá nếu có discountApplied */}
                                {discountApplied > 0 && (
                                    <Typography variant="h6" sx={{ textDecoration: 'line-through', fontFamily: 'SFUFuturaBookOblique' }}>
                                        Tộng cộng: {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </Typography>
                                )}
                                {/* Hiển thị tổng giá trị đơn hàng sau khi giảm giá */}
                                <Typography variant="h6" sx={{ fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' }}>
                                    Tổng cộng: {totalAfterDiscount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
            {/* Snackbar để hiển thị thông báo */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={12000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                    width: 'auto', // Đặt chiều rộng tự động hoặc giá trị cụ thể
                    maxWidth: '90%', // Giới hạn chiều rộng tối đa
                    '& .MuiSnackbarContent-root': {
                        width: '100%', // Đặt chiều rộng cho nội dung
                        maxWidth: '1200px', // Giới hạn chiều rộng tối đa cho nội dung
                    }
                }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container >
    );
};

export default CheckOutPage;
