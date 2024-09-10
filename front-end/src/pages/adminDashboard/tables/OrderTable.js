import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    IconButton,
    Button,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    TableContainer,
    Typography,
    TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Tooltip from '@mui/material/Tooltip';
import MuiAlert from '@mui/material/Alert';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
//import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fetchOrders, deleteOrder } from '../../../redux/actions/orderActions';
import AddOrderModal from '../../../components/common/utilities/modal/orderModals/AddOrderModal';
import EditOrderModal from '../../../components/common/utilities/modal/orderModals/EditOrderModal';

const OrderTable = () => {
    const dispatch = useDispatch();
    const { loading, orders, total, error } = useSelector((state) => state.orders);

    // State quản lý đóng mở EditModal
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    // State quản lý đóng mở AddModal
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    // State quản lý sort
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // State quản lý lọc ngày
    const [filterDate, setFilterDate] = useState(null);

    // State quản lý đóng mở Snackbar thông báo
    const [globalSnackbarOpen, setGlobalSnackbarOpen] = useState(false);
    const [globalSnackbarMessage, setGlobalSnackbarMessage] = useState('');
    const [globalSnackbarSeverity, setGlobalSnackbarSeverity] = useState('info');

    // State quản lý đóng mở Dialog Delete
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchOrders(page + 1, rowsPerPage));
    }, [dispatch, page, rowsPerPage]);

    // Handle change page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        dispatch(fetchOrders(newPage + 1, rowsPerPage));
    };

    // Handle change rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        dispatch(fetchOrders(1, parseInt(event.target.value, 10)));
    };

    // Hàm đóng mở globalSnackbar
    const openGlobalSnackbar = (message, severity) => {
        setGlobalSnackbarMessage(message);
        setGlobalSnackbarSeverity(severity);
        setGlobalSnackbarOpen(true);
    };

    // Hàm xử lý việc sắp xếp khi người dùng click vào tiêu đề cột
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Hàm để sắp xếp dữ liệu dựa trên cấu hình sắp xếp
    const combinedFilteredOrders = React.useMemo(() => {
        // Ensure orders.data is always an array
        const safeOrdersData = orders.data || [];

        let filtered = [...safeOrdersData];

        // Sắp xếp
        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        // Lọc theo trạng thái và tên khách hàng
        filtered = filtered.filter(order =>
            (filterStatus === '' || order.status === filterStatus) &&
            (searchTerm === '' || order.customerDetails?.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
        );


        // Lọc theo ngày
        if (filterDate) {
            const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.orderDate);
                return orderDate >= startOfDay && orderDate <= endOfDay;
            });
        }

        return filtered;
    }, [orders.data, sortConfig, filterStatus, searchTerm, filterDate]);

    // Hàm xử lý khi ấn Edit
    const handleEdit = (order) => {
        setCurrentOrder(order);
        setEditModalOpen(true);
    };

    // Hàm xử lý khi ấn Add
    const handleAdd = () => {
        setAddModalOpen(true);
    };

    // Hàm xử lý đóng mở Dialog Delete
    const handleConfirmDeleteOpen = (orderId) => {
        setSelectedOrderId(orderId);
        setDeleteConfirmOpen(true);
    };
    const handleConfirmDeleteClose = () => {
        setDeleteConfirmOpen(false);
        setSelectedOrderId(null);
    };

    // Hàm xử lý khi ấn nút Delete
    const handleDelete = (orderId) => {
        dispatch(deleteOrder(orderId))
            .then(() => {
                openGlobalSnackbar("Đơn hàng đã được xóa thành công.", "success");
                handleConfirmDeleteClose();
                dispatch(fetchOrders());
            })
            .catch(error => {
                openGlobalSnackbar(`Lỗi khi xóa đơn hàng: ${error.message}`, "error");
                handleConfirmDeleteClose();
            });
    };

    // Hàm Để Xác Định Màu Nền Tùy Thuộc Trạng Thái Đơn Hàng
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#f9c74f'; // Màu vàng
            case 'Canceled':
                return '#f94144'; // Màu đỏ
            case 'Done':
                return '#90be6d'; // Màu xanh lá
            default:
                return 'inherit'; // Màu mặc định
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    // Check if orders is defined and is an array before mapping
    if (!orders || !Array.isArray(orders.data)) {
        return <Alert severity="warning">No order data available.</Alert>;
    }

    // Các style dùng chung cho các component
    const tableHeaderStyles = { fontWeight: 'bold', fontSize: '1.2em', fontFamily: 'SFUFuturaBookOblique' };

    const tableRowStyles = { fontFamily: 'SFUFuturaBookOblique', fontSize: '1em' };

    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };

    return (
        <>
            <Box display="flex" justifyContent="center" marginBottom={2} marginTop={5}>
                <Typography variant="h4" component="div" sx={{ fontFamily: 'SFUFuturaBookOblique' }}>
                    DANH SÁCH ĐƠN HÀNG
                </Typography>
            </Box>

            <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
                <div style={{ margin: '20px' }}>
                    <TextField 
                        label="Tìm theo tên khách hàng"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <FormControl style={{ width: 200 }}>
                        <InputLabel id="status-select-label">Lọc theo trạng thái</InputLabel>
                        <Select
                            labelId="status-select-label"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            label="Lọc theo trạng thái"
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Canceled">Canceled</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                        </Select>
                    </FormControl>
                    
                </div>
                <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                    <Button
                        startIcon={<AddIcon />}
                        color="primary"
                        variant="contained"
                        style={{ margin: '10px' }}
                        onClick={handleAdd}
                        sx={buttonStyle}
                    >
                        Tạo Đơn Hàng
                    </Button>
                </Box>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={tableHeaderStyles} align='center'>Mã Đơn Hàng</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Khách Hàng</TableCell>
                            <Tooltip title="Click để sắp xếp">
                                <TableCell onClick={() => handleSort('orderDate')} style={tableHeaderStyles} align='center'>
                                    Ngày Tạo Đơn Hàng {sortConfig.key === 'orderDate' ? (sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : ''}
                                </TableCell>
                            </Tooltip>
                            <TableCell style={tableHeaderStyles} align='center'>Sản Phẩm</TableCell>
                            <Tooltip title="Click để sắp xếp">
                                <TableCell onClick={() => handleSort('totalQuantity')} style={tableHeaderStyles} align='center'>
                                    Số Lượng Sản Phẩm Trong Đơn Hàng {sortConfig.key === 'totalQuantity' ? (sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : ''}
                                </TableCell>
                            </Tooltip>
                            <Tooltip title="Click để sắp xếp">
                                <TableCell onClick={() => handleSort('cost')} style={tableHeaderStyles} align='center'>
                                    Tổng Đơn Hàng {sortConfig.key === 'cost' ? (sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : ''}
                                </TableCell>
                            </Tooltip>
                            <TableCell style={tableHeaderStyles} align='center'>Hình Thức Thanh Toán</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Tình Trạng</TableCell>
                            <TableCell style={tableHeaderStyles} align='center'>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {combinedFilteredOrders && combinedFilteredOrders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell sx={tableRowStyles} align='center'>{order._id}</TableCell>
                                <TableCell sx={tableRowStyles} align='center'>{order.customerDetails ? order.customerDetails.fullName : order.customer}</TableCell>                            
                                <TableCell sx={tableRowStyles} align='center'>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell sx={tableRowStyles} align='center'>
                                    {order.products.map((p, index) => (
                                        <div key={index}>
                                            {p.product.name} - {p.size} - {p.color} (Qty: {p.quantity})
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell sx={tableRowStyles} align='center'>{order.totalQuantity}</TableCell>
                                <TableCell sx={tableRowStyles} align='center'>{order.cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                <TableCell sx={tableRowStyles} align='center'>{order.paymentType}</TableCell>
                                <TableCell
                                    style={{
                                        backgroundColor: getStatusColor(order.status),
                                        color: 'white',
                                    }}
                                    align='center'
                                >
                                    {order.status}
                                </TableCell>
                                <TableCell align='center'>
                                    <IconButton onClick={() => handleEdit(order)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleConfirmDeleteOpen(order._id)} color="secondary">
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
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {isAddModalOpen && (
                    <AddOrderModal
                        open={isAddModalOpen}
                        handleClose={() => setAddModalOpen(false)}
                        openGlobalSnackbar={openGlobalSnackbar}
                    />
                )}
                {isEditModalOpen && (
                    <EditOrderModal
                        open={isEditModalOpen}
                        handleClose={() => setEditModalOpen(false)}
                        order={currentOrder}
                        openGlobalSnackbar={openGlobalSnackbar}
                    />
                )}
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

            <Dialog
                open={deleteConfirmOpen}
                onClose={handleConfirmDeleteClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa đơn hàng"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa đơn hàng này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDeleteClose} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={() => handleDelete(selectedOrderId)} color="primary" autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrderTable;