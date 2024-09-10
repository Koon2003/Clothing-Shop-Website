import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Paper, TextField, Button, Typography, Grid, Box } from "@mui/material";
import {
  fetchCategories,
  updateCategory,
} from "../../../../../redux/actions/categoryActions";

const EditCategoryModal = ({
  open,
  handleClose,
  category,
  openGlobalSnackbar,
}) => {
  // Get dispatch function from redux store
  const dispatch = useDispatch();
  // Local state
  const [editedCategory, setEditedCategory] = useState({
    name: "",
    description: "",
  });

  // Set initial category data
  useEffect(() => {
    if (category) {
      setEditedCategory({
        name: category.name,
        description: category.description,
      });
    }
  }, [category]);

  // Handle input change
  const handleChange = (e) => {
    setEditedCategory({ ...editedCategory, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra xem tất cả trường dữ liệu có được nhập hay không
    if (!editedCategory.name.trim() || !editedCategory.description.trim()) {
      openGlobalSnackbar("Vui lòng nhập đủ thông tin!", "warning");
      return;
    }

    try {
      // Thực hiện cập nhật danh mục
      await dispatch(updateCategory(category._id, editedCategory));
      // Hiển thị thông báo thành công
      openGlobalSnackbar("Danh mục đã được cập nhật thành công!", "success");
      dispatch(fetchCategories());
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có
      openGlobalSnackbar(
        "Lỗi khi cập nhật danh mục: " + error.message,
        "error"
      );
    } finally {
      // Đóng modal sau khi thao tác hoàn tất
      handleClose();
    }
  };

  // Style cho các component
  const headerStyle = {
    fontFamily: "SFUFuturaBookOblique",
    fontWeight: "bold",
    fontSize: "1.4rem",
  };
  const buttonStyle = {
    backgroundColor: "black",
    fontFamily: "SFUFuturaBookOblique",
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper style={{ padding: 20, margin: "20px auto", maxWidth: 500 }}>
        <Typography
          variant="h6"
          sx={headerStyle}
          marginBottom={2}
          align="center"
        >
          Sửa Loại Sản Phẩm
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Loại Sản Phẩm"
              name="name"
              value={category.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô Tả"
              name="description"
              value={category.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>
        </Grid>
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            sx={buttonStyle}
            onClick={handleSubmit}
            color="primary"
            variant="contained"
          >
            Lưu
          </Button>
          <Button onClick={handleClose} variant="outlined">
            Hủy
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default EditCategoryModal;
