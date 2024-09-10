import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Snackbar, Table, TableHead, TableRow, TableCell, TableBody, Button, TableContainer, Paper, Box, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Tab } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCollection, fetchCollections } from '../../../redux/actions/collectionActions';
import AddCollectionModal from '../../../components/common/utilities/modal/collectionModals/AddCollectionModal';
import EditCollectionModal from '../../../components/common/utilities/modal/collectionModals/EditCollectionModal';

const CollectionTable = () => {
    const dispatch = useDispatch();
    const collections = useSelector(state => state.collections.collections);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    // State quản lý đóng mở Snackbar thông báo
    const [globalSnackbarOpen, setGlobalSnackbarOpen] = useState(false);
    const [globalSnackbarMessage, setGlobalSnackbarMessage] = useState('');
    const [globalSnackbarSeverity, setGlobalSnackbarSeverity] = useState('info');

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // State quản lý xác nhận xóa
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);

    // Handle change page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle change rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Hàm đóng mở globalSnackbar
    const openGlobalSnackbar = (message, severity) => {
        setGlobalSnackbarMessage(message);
        setGlobalSnackbarSeverity(severity);
        setGlobalSnackbarOpen(true);
    };

    useEffect(() => {
        dispatch(fetchCollections());
    }, [dispatch]);

    const handleEditClick = (collection) => {
        setSelectedCollection(collection);
        setShowEditModal(true);
    };

    const renderImages = (images) => {
        return images.map((image, index) => (
            <img key={index} src={image} alt={`Collection ${index}`} style={{ width: '50px', height: '50px', marginRight: '5px' }} />
        ));
    };

    // Hàm xử lý sự kiện khi click vào confirm trên Modal xóa
    const handleDeleteConfirmOpen = collectionId => {
        setSelectedCollectionId(collectionId);
        setDeleteConfirmOpen(true);
    };

    // Hàm xử lý sự kiện khi click vào cancel trên Modal xóa
    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };

    // Hàm xử lý sự kiện khi click vào nút xóa trên Modal xóa
    const handleDelete = async collectionId => {
        try {
            // Xóa Bộ sưu tập và đợi cho đến khi quá trình hoàn tất
            await dispatch(deleteCollection(collectionId));
            openGlobalSnackbar("Bộ sưu tập đã được xóa thành công.", "success");
            // Cập nhật lại danh sách Bộ sưu tập sau khi xóa thành công
            dispatch(fetchCollections());
        } catch (error) {
            // Hiển thị thông báo lỗi nếu có
            openGlobalSnackbar("Lỗi khi xóa Bộ sưu tập: " + error.message, "error");
        } finally {
            // Đóng cửa sổ xác nhận xóa
            handleDeleteConfirmClose();
        }
    };

    // Các style dùng chung cho các component
    const tableHeaderStyles = { fontWeight: 'bold', fontSize: '1.2em', fontFamily: 'SFUFuturaBookOblique' };

    const tableRowStyles = { fontFamily: 'SFUFuturaBookOblique', fontSize: '1em' };

    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };

    return (
        <>
            <Box display="flex" justifyContent="center" marginBottom={2} marginTop={5}>
                <Typography variant="h4" component="div" sx={{ fontFamily: 'SFUFuturaBookOblique' }}>
                    DANH SÁCH BỘ SƯU TẬP
                </Typography>
            </Box>
            <TableContainer component={Paper}>
                <Box display="flex" justifyContent="flex-end" marginBottom={2}>
                    <Button
                        variant='contained'
                        color='primary'
                        startIcon={<AddIcon />}
                        sx={buttonStyle}
                        onClick={() => setShowAddModal(true)}
                    >
                        Tạo Bộ Sưu Tập
                    </Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableHeaderStyles} align='center'>Tên Bộ Sưu Tập</TableCell>
                            <TableCell sx={tableHeaderStyles} align='center'>Mô Tả</TableCell>
                            <TableCell sx={tableHeaderStyles} align='center'>Ảnh</TableCell>
                            <TableCell sx={tableHeaderStyles} align='center'>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {collections.map(collection => (
                            <TableRow key={collection._id}>
                                <TableCell sx={tableRowStyles} align='center'>{collection.name}</TableCell>
                                <TableCell sx={tableRowStyles} align='center'>{collection.description}</TableCell>
                                <TableCell sx={tableRowStyles} align='center'>{renderImages(collection.images)}</TableCell>
                                <TableCell align='center'>
                                    <Button onClick={() => handleEditClick(collection)}>
                                        <EditIcon />
                                    </Button>
                                    <Button onClick={() => handleDeleteConfirmOpen(collection._id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination 
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={collections?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            {/* Modals */}
            {showAddModal && (
                <AddCollectionModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                handleClose={() => setShowAddModal(false)} // Truyền handleClose để đóng Modal
                openGlobalSnackbar={openGlobalSnackbar}
            />
            )} 

            {showEditModal && (
                <EditCollectionModal
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    handleClose={() => setShowEditModal(false)} // Truyền handleClose để đóng Modal
                    collection={selectedCollection}
                    openGlobalSnackbar={openGlobalSnackbar}
                />
            )}               

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteConfirmClose}
            >
                <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
                <DialogContent>
                    <DialogContentText>Bạn có chắc chắn muốn xóa danh mục này không?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmClose} color="primary">Hủy</Button>
                    <Button onClick={() => handleDelete(selectedCollectionId)} color="secondary">Xóa</Button>
                </DialogActions>
            </Dialog>

            {/* Global snackbar */}
            <Snackbar
                open={globalSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setGlobalSnackbarOpen(false)}
            >
                <MuiAlert elevation={6} variant="filled" severity={globalSnackbarSeverity}>
                    {globalSnackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default CollectionTable;