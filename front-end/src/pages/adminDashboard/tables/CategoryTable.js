import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TableContainer,
  Typography,
  Table,
  TablePagination,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteCategory,
  fetchCategories,
} from "../../../redux/actions/categoryActions";
import AddCategoryModal from "../../../components/common/utilities/modal/categoryModals/AddCategoryModal";
import EditCategoryModal from "../../../components/common/utilities/modal/categoryModals/EditCategoryModal";

const CategoryTable = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  const [currentCategory, setCurrentCategory] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // State quản lý đóng mở Snackbar thông báo
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

  // Fetch danh sách danh mục
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Hàm đóng mở globalSnackbar
  const openGlobalSnackbar = (message, severity) => {
    setGlobalSnackbarMessage(message);
    setGlobalSnackbarSeverity(severity);
    setGlobalSnackbarOpen(true);
  };

  // Kiểm tra và xác định categories.data là mảng trước khi render
  const safeCategories = categories.data || [];
  console.log(safeCategories);

  // Hàm xử lý sự kiện khi click vào nút sửa
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setEditModalOpen(true);
  };

  // Hàm xử lý sự kiện khi click vào nút thêm
  const handleAdd = () => {
    setAddModalOpen(true);
  };

  // Hàm xử lý sự kiện khi click vào confirm trên Modal xóa
  const handleDeleteConfirmOpen = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setDeleteConfirmOpen(true);
  };

  // Hàm xử lý sự kiện khi click vào cancel trên Modal xóa
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };

  // Hàm xử lý sự kiện khi click vào nút xóa trên Modal xóa
  const handleDelete = async (categoryId) => {
    try {
      // Xóa danh mục và đợi cho đến khi quá trình hoàn tất
      await dispatch(deleteCategory(categoryId));
      openGlobalSnackbar("Danh mục đã được xóa thành công.", "success");
      // Cập nhật lại danh sách danh mục sau khi xóa thành công
      dispatch(fetchCategories());
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có
      openGlobalSnackbar("Lỗi khi xóa danh mục: " + error.message, "error");
    } finally {
      // Đóng cửa sổ xác nhận xóa
      handleDeleteConfirmClose();
    }
  };

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
          DANH SÁCH LOẠI SẢN PHẨM
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Box display="flex" justifyContent="flex-end" marginBottom={2}>
          <Button
            onClick={handleAdd}
            color="primary"
            startIcon={<AddIcon />}
            variant="contained"
            sx={buttonStyle}
          >
            Tạo Loại Sản Phẩm
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={tableHeaderStyles} align="center">
                Loại Sản Phẩm
              </TableCell>
              <TableCell style={tableHeaderStyles} align="center">
                Mô Tả
              </TableCell>
              <TableCell style={tableHeaderStyles} align="center">
                Hành Động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeCategories.map((category) => (
              <TableRow key={category._id}>
                <TableCell sx={tableRowStyles} align="center">{category.name}</TableCell>
                <TableCell sx={tableRowStyles} align="center">
                  {category.description}
                </TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleEdit(category)}>
                    <EditIcon />
                  </Button>
                  <Button onClick={() => handleDeleteConfirmOpen(category._id)}>
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
          count={categories?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {isAddModalOpen && (
        <AddCategoryModal
          open={isAddModalOpen}
          handleClose={() => setAddModalOpen(false)}
          category={currentCategory}
          openGlobalSnackbar={openGlobalSnackbar}
        />
      )}
      {isEditModalOpen && (
        <EditCategoryModal 
            open={isEditModalOpen}
            handleClose={() => setEditModalOpen(false)}
            category={currentCategory}
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
          <Button
            sx={buttonStyle}
            color="primary"
            onClick={handleDeleteConfirmClose}
          >
            Hủy
          </Button>
          <Button
            sx={buttonStyle}
            color="secondary"
            onClick={() => handleDelete(selectedCategoryId)}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default CategoryTable;
