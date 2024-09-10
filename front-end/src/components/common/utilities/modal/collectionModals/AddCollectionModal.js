import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, Paper, Typography, Grid, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { createCollection } from '../../../../../redux/actions/collectionActions';

const AddCollectionModal = ({ open, handleClose, onClose, openGlobalSnackbar }) => {
    // State quản lý các trường nhập liệu
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);

    // Dispatch action
    const dispatch = useDispatch();

    useEffect(() => {
        const loadCloudinaryScript = () => {
            const script = document.createElement('script');
            script.src = `${process.env.REACT_APP_CLOUDINARY_SOURCE}`;
            script.async = true;
            script.onload = () => initCloudinaryWidget();
            document.body.appendChild(script);
        };

        const initCloudinaryWidget = () => {
            if (window.cloudinary) {
                // Widget initialization logic here
            } else {
                console.error("Cloudinary script not loaded");
            }
        };

        loadCloudinaryScript();
        console.log(window.cloudinary);
        /*
        // Cleanup function 
        return () => {
            const cloudinaryScriptURL = process.env.REACT_APP_CLOUDINARY_SOURCE;

            // Xóa script và widget khi unmount
            const cloudinaryScript = document.querySelector(`script[src="${cloudinaryScriptURL}"]`);
            if (cloudinaryScript) {
                document.body.removeChild(cloudinaryScript);
            }
        }; */
    }, [open]); 


    // Định nghĩa hàm mới để mở Cloudinary widget thay vì xử lý file input
    const handleImageUpload = () => {
        //window.cloudinaryWidget.open(); // Mở widget
        if (window.cloudinary) {
            // Đặt cấu hình cho Cloudinary Upload Widget
            window.cloudinary.createUploadWidget({
                cloudName: `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`,
                uploadPreset: `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`,
                sources: ['local', 'url', 'camera'],
                multiple: true,
                maxFiles: 5,
                cropping: false, // Có thể cấu hình nếu bạn muốn cắt ảnh
                folder: 'uploads/newCollection', // Thư mục lưu ảnh trên Cloudinary
                // Các cấu hình khác nếu cần
            }, (error, result) => {
                if (!error && result && result.event === 'success') {
                    setImages(prevImages => [...prevImages, result.info.secure_url]);
                }
                console.log(images);
            }).open();
        } else {
            console.error('Cloudinary script not loaded');
        }
    };

    // Hàm xử lý xóa ảnh trên Modal
    const handleRemoveImage = (imageUrl) => {
        if (images && images.length) {
            setImages(images.filter(image => image !== imageUrl));
        }
    };

    // Hàm xử lý khi click vào nút Submit
    const handleSubmit = async () => {
        try {
            // Dispatch the createCollection action and wait for it to complete
            await dispatch(createCollection({ name, description, images }));
            // If successful, show the snackbar and clear form
            openGlobalSnackbar('Tạo Bộ Sưu Tập thành công!', 'success');
            // Clear form and images state
            setName('');
            setDescription('');
            setImages([]);
            // Call onClose to close the modal and refresh the table
            onClose();
        } catch (error) {
            // If there is an error, show it in the snackbar
            openGlobalSnackbar('Có lỗi khi tạo Bộ Sưu Tập: ' + error.message, 'error');
        }
    };

    // Hàm xử lý khi click vào nút Hủy
    const handleCancel = () => {
        // Logic khi ấn nút Hủy
        handleClose(); // Gọi hàm để đóng Modal
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper style={{ padding: 20, margin: '20px auto', maxWidth: 500, overflow: 'auto', maxHeight: '90vh' }}>
                <Typography variant="h6" component="h2" style={{ ...headerStyle, marginBottom: 20 }}>
                    Thêm Bộ Sưu Tập Mới
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField 
                            label="Tên"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label="Mô tả"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' onClick={handleImageUpload} sx={buttonStyle}>Tải Ảnh Lên</Button>
                    </Grid>
                    {images.map((image, index) => (
                        <Grid item xs={4} key={index}>
                            <Box position="relative" display="inline-block">
                                <img src={image} alt={`Uploaded ${index}`} style={{ width: '100%', height: 'auto' }} />
                                <IconButton
                                    onClick={() => handleRemoveImage(image)}
                                    style={{ position: 'absolute', top: 0, right: 0 }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Box mt={4} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleSubmit} style={buttonStyle}>
                        Thêm
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel} style={{ marginLeft: 10 }}>
                        Hủy   
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AddCollectionModal;