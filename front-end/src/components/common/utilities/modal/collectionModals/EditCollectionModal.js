import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, TextField, Button, Paper, Grid, IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateCollection } from '../../../../../redux/actions/collectionActions';
import DeleteIcon from '@mui/icons-material/Delete';

const EditCollectionModal = ({ open, handleClose, onClose, collection, openGlobalSnackbar }) => {
    // Local state
    const [name, setName] = useState(collection.name);
    const [description, setDescription] = useState(collection.description);
    const [images, setImages] = useState(collection.images);
    // Dispatch action
    const dispatch = useDispatch();

    
    // Hàm xử lý khi đóng modal
    useEffect(() => {
        const loadCloudinaryScript = () => {
            const script = document.createElement('script');
            script.src = `${process.env.REACT_APP_CLOUDINARY_SOURCE}`;
            script.async = true;
            script.onload = initCloudinaryWidget;
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
                folder: 'uploads/editCollection', // Thư mục lưu ảnh trên Cloudinary
                // Các cấu hình khác nếu cần
            }, (error, result) => {
                if (!error && result && result.event === 'success') {
                    setImages(prevImages => [...prevImages, result.info.secure_url]);
                }
            }).open();
        }
    };

    // Hàm xử lý khi xóa ảnh
    const handleRemoveImage = (imageToRemove) => {
        setImages(images.filter(image => image !== imageToRemove));
    };

    // Hàm xử lý khi đóng modal
    const handleSubmit = async () => {
        try {
            await dispatch(updateCollection(collection._id, { name, description, images }));
            openGlobalSnackbar('Cập nhật Bộ Sưu Tập thành công!', 'success');
            onClose();
        } catch (error) {
            openGlobalSnackbar('Có lỗi khi cập nhật Bộ Sưu Tập: ' + error.message, 'error');
        }
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };


    return (
        <Modal open={open} onClose={onClose}>
            <Paper style={{ padding: 20, margin: '20px auto', maxWidth: 600, overflow: 'auto', maxHeight: '90vh' }}>
                <Typography variant="h6" component="h2" style={{ ...headerStyle, marginBottom: 20 }}>
                    Sửa Bộ Sưu Tập
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleImageUpload} sx={{...buttonStyle, mb: '10px'}}>Tải Ảnh Lên</Button>
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
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={buttonStyle}> 
                        Sửa Bộ Sưu Tập
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose} style={{ marginLeft: 10 }}>
                        Hủy
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default EditCollectionModal;
