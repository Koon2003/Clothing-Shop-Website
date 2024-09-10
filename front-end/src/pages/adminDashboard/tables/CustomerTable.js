import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Snackbar, TextField, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Box,
    Typography,
    TableContainer,
    IconButton,
    TablePagination
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import "./css/CustomerTable.css";
import { deleteCustomer, fetchCustomers } from '../../../redux/actions/customerActions';
import AddCustomerModal from '../../../components/common/utilities/modal/customerModals/AddCustomerModal';
import EditCustomerModal from '../../../components/common/utilities/modal/customerModals/EditCustomerModal';

const CustomerTable = () => {
    const dispatch = useDispatch();
    const { customers, loading, error, notification } = useSelector(state => state.customers);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);

    const [globalSnackbarOpen, setGlobalSnackbarOpen] = useState(false);
    const [globalSnackbarMessage, setGlobalSnackbarMessage] = useState('');
    const [globalSnackbarSeverity, setGlobalSnackbarSeverity] = useState('info');

    // State quản lý việc lọc
    const [filter, setFilter] = useState('');

    // State quản lý việc mở và đóng Dialog delete
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Handle change page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle change rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // State quản lý mở đóng Snackbar thong báo
    const openGlobalSnackbar = (message, severity) => {
        setGlobalSnackbarMessage(message);
        setGlobalSnackbarSeverity(severity);
        setGlobalSnackbarOpen(true);
    };

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    useEffect(() => {
        if (notification) {
            openGlobalSnackbar(notification, 'success');
            dispatch({ type: 'CLEAR_CUSTOMER_NOTIFICATION' }); // Xóa thông báo sau khi hiển thị
        }
    }, [notification]);

    // Xử lý thay đổi trên input
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Hàm xử lý khi ấn nút Edit
    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    // Hàm xử lý khi ấn nút Add
    const handleAddClick = () => {
        setAddModalOpen(true);
    };

    // Hàm mở và đóng Dialog Delete
    const handleOpenConfirmDelete = (customer) => {
        setCustomerToDelete(customer);
        setConfirmDeleteOpen(true);
    };

    const handleCloseConfirmDelete = () => {
        setConfirmDeleteOpen(false);
        setCustomerToDelete(null);
    };

    // Hàm xử lý khi ấn nút Delete
    const handleDeleteClick = async (customerId) => {
        try {
            const ordersResponse = await fetch(`${process.env.REACT_APP_API_URL}/customers/${customerId}/orders`);
            if (!ordersResponse.ok) throw new Error('Không thể lấy thông tin đơn hàng');

            const { orders } = await ordersResponse.json();

            if (orders && orders.length > 0) {
                handleOpenConfirmDelete({ id: customerId, orders });
            } else {
                // Xóa trực tiếp nếu không có đơn hàng liên quan
                await dispatch(deleteCustomer(customerId));
                openGlobalSnackbar('Khách hàng đã được xóa thành công', 'success');
                dispatch(fetchCustomers());
            }
        } catch (error) {
            openGlobalSnackbar(`Lỗi khi xóa khách hàng: ${error.message}`, 'error');
        }
    };

    // Kiểm tra xem customers.data có phải là mảng không trước khi render
    if (!customers.data || !Array.isArray(customers.data)) {
        return <p>No customers data available</p>;
    }

    // Lọc dữ liệu khách hàng
    const filteredCustomers = customers.data.filter(customer => {
        const searchStr = filter.toLowerCase();
        return (
            customer.fullName.toLowerCase().includes(searchStr) ||
            customer.phone.includes(searchStr) ||
            customer.email.toLowerCase().includes(searchStr) ||
            customer.user.includes(searchStr) ||
            customer.orders.join(', ').includes(searchStr)
        );
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Các style dùng chung cho các component
    const tableHeaderStyles = { fontWeight: 'bold', fontSize: '1.2em', fontFamily: 'SFUFuturaBookOblique' };

    const tableRowStyles = { fontFamily: 'SFUFuturaBookOblique', fontSize: '1em' };

    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };

    return (
        <>
            <Box display="flex" justifyContent="center" marginBottom={2} marginTop={5}>
                <Typography variant="h4" component="div" sx={{ fontFamily: 'SFUFuturaBookOblique' }}>
                    DANH SÁCH KHÁCH HÀNG
                </Typography>
            </Box>

            <div className='table-header'>
                {/* Trường input để lọc */}
                <TextField 
                    label="Tìm theo địa chỉ, số điện thoại, email"
                    variant='outlined'
                    onChange={handleFilterChange}
                    className="filter-field"
                />
            </div>
            <TableContainer component={Paper}>
                <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        sx={buttonStyle}
                    >
                        Thêm Khách Hàng
                    </Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={tableHeaderStyles} align='center'>Tên</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Email</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Số điện thoại</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Địa chỉ</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Thành phố</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Quận/Huyện</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Phường/Xã</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Tài khoản</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Đơn Hàng</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCustomers.map(customer => (
                            <TableRow key={customer._id}>
                                <TableCell sx={tableRowStyles}>{customer.fullName}</TableCell>
                                <TableCell sx={tableRowStyles}>{customer.email}</TableCell>
                                <TableCell sx={tableRowStyles}>{customer.phone}</TableCell>
                                <TableCell sx={tableRowStyles}>{customer.address}</TableCell>
                                <TableCell sx={tableRowStyles}>{customer.city}</TableCell>
                                <TableCell sx={tableRowStyles}>{customer.district}</TableCell>
                                <TableCell sx={tableRowStyles}>{customer.ward}</TableCell>
                                <TableCell sx={tableRowStyles}>{customer.user}</TableCell>
                                <TableCell sx={tableRowStyles}>{customer.orders.join(', ')}</TableCell>
                                <TableCell sx={tableRowStyles}>
                                    {/* Thêm nút Edit và Delete tại đây */}
                                    <IconButton color="primary" onClick={() => handleEditClick(customer)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDeleteClick(customer._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination 
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={customers?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <Snackbar
                open={globalSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setGlobalSnackbarOpen(false)}
            >
                <MuiAlert elevation={6} variant="filled" severity={globalSnackbarSeverity}>
                    {globalSnackbarMessage}
                </MuiAlert>
            </Snackbar>

            {addModalOpen && (
                <AddCustomerModal
                    open={addModalOpen}
                    handleClose={() => setAddModalOpen(false)}
                    openGlobalSnackbar={openGlobalSnackbar}
                />
            )}

            {selectedCustomer && (
                <EditCustomerModal
                    open={editModalOpen}
                    handleClose={() => setEditModalOpen(false)}
                    customer={selectedCustomer}
                    openGlobalSnackbar={openGlobalSnackbar}
                />
            )}

            <Dialog
                open={confirmDeleteOpen}
                onClose={handleCloseConfirmDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa khách hàng"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Khách hàng này có đơn hàng liên quan. Bạn có chắc chắn muốn xóa không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={() => {
                        dispatch(deleteCustomer(customerToDelete.id));
                        handleCloseConfirmDelete();
                    }} color="primary" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CustomerTable;