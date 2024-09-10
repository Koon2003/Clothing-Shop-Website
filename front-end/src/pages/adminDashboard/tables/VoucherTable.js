import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  deleteVoucher,
  fetchVouchers,
} from "../../../redux/actions/voucherActions";
import AddVoucherModal from "../../../components/common/utilities/modal/voucherModals/AddVoucherModal";
import EditVoucherModal from "../../../components/common/utilities/modal/voucherModals/EditVoucherModal";

const VoucherTable = () => {
  const dispatch = useDispatch();
  const { vouchers, loading, error } = useSelector((state) => state.voucher);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  const [globalSnackbarOpen, setGlobalSnackbarOpen] = useState(false);
  const [globalSnackbarMessage, setGlobalSnackbarMessage] = useState("");
  const [globalSnackbarSeverity, setGlobalSnackbarSeverity] = useState("info");

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

  // Hàm đóng mở globalSnackbar
  const openGlobalSnackbar = (message, severity) => {
    setGlobalSnackbarMessage(message);
    setGlobalSnackbarSeverity(severity);
    setGlobalSnackbarOpen(true);
  };

  // Fetch danh sách danh mục
  useEffect(() => {
    dispatch(fetchVouchers());
  }, [dispatch]);

  // Kiểm tra và xác định vouchers.data là mảng trước khi render
  const safeVouchers =
    vouchers && Array.isArray(vouchers.data) ? vouchers.data : [];

  // Hàm xử lý sự kiện khi click vào nút sửa
  const handleDeleteConfirmOpen = (categoryId) => {
    setSelectedVoucherId(categoryId);
    setDeleteConfirmOpen(true);
  };

  // Hàm xử lý sự kiện khi click vào nút hủy xóa
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

  // Hàm xử lý sự kiện khi click vào nút xóa
  const handleDelete = (voucherId) => {
    dispatch(deleteVoucher(voucherId))
      .then(() => {
        openGlobalSnackbar("Voucher đã được xóa thành công.", "success");
        // Có thể cập nhật lại danh sách vouchers sau khi xóa
        dispatch(fetchVouchers());
      })
      .catch((error) => {
        openGlobalSnackbar(
          `Xảy ra lỗi khi xóa voucher: ${error.message}`,
          "error"
        );
      });
    handleDeleteConfirmClose();
  };

  // Hàm xử lý sự kiện khi click vào nút thêm
  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  // Hàm xử lý sự kiện khi click vào nút sửa
  const handleEditClick = (voucher) => {
    setCurrentVoucher(voucher);
    setEditModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Các style dùng chung cho các component
  const tableHeaderStyles = {
    fontWeight: "bold",
    fontSize: "1.2em",
    fontFamily: "SFUFuturaBookOblique",
  };

  const tableRowStyles = {
    fontFamily: "SFUFuturaBookOblique",
    fontSize: "1em",
  };

  const buttonStyle = {
    backgroundColor: "black",
    fontFamily: "SFUFuturaBookOblique",
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        marginBottom={2}
        marginTop={5}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{ fontFamily: "SFUFuturaBookOblique" }}
        >
          DANH SÁCH VOUCHER
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Box display="flex" justifyContent="flex-end" marginBottom={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={buttonStyle}
          >
            Thêm Voucher
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeaderStyles} align="center">
                Code
              </TableCell>
              <TableCell sx={tableHeaderStyles} align="center">
                Discount
              </TableCell>
              <TableCell sx={tableHeaderStyles} align="center">
                Ngày Hết Hạn
              </TableCell>
              <TableCell sx={tableHeaderStyles} align="center">
                Hành Động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeVouchers.map((voucher) => (
              <TableRow key={voucher._id}>
                <TableCell sx={tableRowStyles} align="center">
                  {voucher.code}
                </TableCell>
                <TableCell sx={tableRowStyles} align="center">
                  {voucher.discount}
                </TableCell>
                <TableCell sx={tableRowStyles} align="center">
                  {new Date(voucher.expiresAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(voucher)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteConfirmOpen(voucher._id)}
                  >
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
          count={vouchers?.length || 0}
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
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={globalSnackbarSeverity}
        >
          {globalSnackbarMessage}
        </MuiAlert>
      </Snackbar>
      {isAddModalOpen && (
        <AddVoucherModal
          open={isAddModalOpen}
          handleClose={() => setAddModalOpen(false)}
          openGlobalSnackbar={openGlobalSnackbar}
        />
      )}

      {isEditModalOpen && (
        <EditVoucherModal
          open={isEditModalOpen}
          handleClose={() => setEditModalOpen(false)}
          voucher={currentVoucher}
          openGlobalSnackbar={openGlobalSnackbar}
        />
      )}

      <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa danh mục này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} color="primary">
            Hủy
          </Button>
          <Button
            onClick={() => handleDelete(selectedVoucherId)}
            color="secondary"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoucherTable;
