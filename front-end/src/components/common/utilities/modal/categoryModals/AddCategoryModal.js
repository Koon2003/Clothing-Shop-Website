import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Paper, TextField, Button, Typography, Grid, Box } from "@mui/material";
import { addCategory, fetchCategories } from "../../../../../redux/actions/categoryActions";

const AddCategoryModal = ({ open, handleClose, openGlobalSnackbar }) => {
    // Get dispatch function from redux store
    const dispatch = useDispatch();
    // Local state
    const [category, setCategory] = useState({ name: '', description: '' });

    // Hàm xử lý khi thay đổi input
    const handleChange = (e) => {
        setCategory({...category, [e.target.name]: e.target.value });
    };

    // Hàm xử lý khi submit form
    const handleSubmit = async e => {
        e.preventDefault();
        // Kiểm tra xem tất cả trường dữ liệu có được nhập hay không
        if(!category.name.trim() || !category.description.trim()) {
            openGlobalSnackbar("Vui lòng nhập đủ thông tin!", "warning");
            return;
        }

        try {
            // Thực hiện thêm danh mục mới
            await dispatch(addCategory(category));
            // Hiển thị thông báo thành công
            openGlobalSnackbar("Danh mục đã được thêm thành công!", "success");
            // Cập nhật lại danh sách danh mục
            dispatch(fetchCategories());
        } catch (error) {
            // Hiển thị thông báo lỗi nếu có
            openGlobalSnackbar("Lỗi khi thêm danh mục: " + error.message, "error");
        } finally {
            // Đóng modal sau khi thao tác hoàn tất
            handleClose();
        }
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ padding: 20, margin: '20px auto', maxWidth: 500}}>
                <Typography variant="h6" sx={headerStyle} marginBottom={2} align="center">Thêm Loại Sản Phẩm Mới</Typography>
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
                    <Button sx={buttonStyle} onClick={handleSubmit} color="primary" variant="contained" >Thêm</Button>
                    <Button onClick={handleClose} variant="outlined">Hủy</Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AddCategoryModal;