import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, fetchProducts } from '../../../../../redux/actions/productActions';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    Paper,
    TextField,
    Typography,
    Select,
    MenuItem,
    Modal,
    Box,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { fetchCategories } from '../../../../../redux/actions/categoryActions';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const AddProductModal = ({ open, handleClose, openGlobalSnackbar }) => {
    // Get dispatch function from redux store
    const dispatch = useDispatch();
    // Get categories data from redux store
    const categories = useSelector((state) => state.category.categories);
    // Local state
    const [uploadedCommonImages, setUploadedCommonImages] = useState([]);
    const [uploadedVariantImages, setUploadedVariantImages] = useState({});

    const [currentVariantIndex, setCurrentVariantIndex] = useState(0);


    // Initial State
    const initialProductState = {
        name: '',
        category: '',
        description: '',
        buyPrice: 0,
        promotionPrice: 0,
        commonImageFiles: [],
        isFeatured: false,
        variants: [{ color: '', sizes: [], imageUrl: [], imageFiles: [] }]
    };

    // Product state
    const [product, setProduct] = useState(initialProductState);

    // Fetch categories data
    useEffect(() => {
        // Load Cloudinary script and initialize widget
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
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleVariantChange = (index, e) => {
        const newVariants = [...product.variants];
        newVariants[index][e.target.name] = e.target.value;
        setProduct({ ...product, variants: newVariants });
    };

 
    // Handle size selection
    const handleSizeSelection = (variantIndex, size, isChecked) => {
        const newVariants = [...product.variants];
        const selectedVariant = newVariants[variantIndex];
        const selectedSize = selectedVariant.sizes.find(s => s.size === size);

        if (!selectedSize && isChecked) {
            // Size doesn't exist, add it
            selectedVariant.sizes.push({ size, amount: '', isInStock: false });
        } else if (selectedSize && !isChecked) {
            // Size exists and is unchecked, remove it
            const sizeIndex = selectedVariant.sizes.findIndex(s => s.size === size);
            if (sizeIndex !== -1) {
                selectedVariant.sizes.splice(sizeIndex, 1);
            }
        }

        setProduct({ ...product, variants: newVariants });
    };

    // Handle size amount change
    const handleSizeAmountChange = (variantIndex, size, amount) => {
        const newVariants = product.variants.map((variant, vIndex) => {
            if (vIndex === variantIndex) {
                let newSizes = [...variant.sizes];
                const sizeIndex = newSizes.findIndex((s) => s.size === size);
                if (sizeIndex !== -1) {
                    // Handle empty string input
                    newSizes[sizeIndex].amount = amount === '' ? '' : parseInt(amount);
                    newSizes[sizeIndex].isInStock = amount > 0;
                }
                return { ...variant, sizes: newSizes };
            }
            return variant;
        });
        setProduct({ ...product, variants: newVariants });
    };

    // Handle common image upload
    const uploadToCloudinary = async (isCommon) => {
        console.log("upload");
        if (window.cloudinary) {
            const folderPath = isCommon ? 'uploads/newProducts/commonImages' : 'uploads/newProducts/variantImages';

            await window.cloudinary.createUploadWidget({
                cloudName: `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`,
                uploadPreset: `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`,
                sources: ['local', 'url', 'camera'],
                multiple: true,
                maxFiles: 5, // optional
                folder: folderPath, // optional
                clientAllowedFormats: ['png', 'jpeg', 'jpg'] // optional
            }, (error, result) => {
                if (!error && result && result.event === 'success') {
                    if (isCommon) {
                        setUploadedCommonImages(currentImages => [...currentImages, result.info.secure_url]);
                    } else {
                        const newVariantImages = { ...uploadedVariantImages };
                        newVariantImages[currentVariantIndex] = [...(newVariantImages[currentVariantIndex] || []), result.info.secure_url];
                        setUploadedVariantImages(newVariantImages);
                    }
                }
            }).open();
        } else {
            console.error('Cloudinary script not loaded');
        }
    };

    // Function to open Cloudinary upload widget for variant images
    const openVariantImageUploadWidget = async (variantIndex) => {
        console.log("variantIndex: ", variantIndex);
        //await setCurrentVariantIndex(variantIndex);
        //console.log("currentVariantIndex: ", currentVariantIndex);
        // Ensure Cloudinary is defined
        if (typeof cloudinary === 'undefined') {
            console.error('Cloudinary library is not loaded');
            return;
        }
        // Create the widget
       await window.cloudinary.createUploadWidget({
            cloudName: `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`, // Replace with your Cloudinary cloud name
            uploadPreset: `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`, // Replace with your upload preset
            sources: ['local', 'camera'],
            multiple: true,
            maxFiles: 5, // You can set the max number of files
            folder: 'uploads/newProducts/variantImages', // Optional: specify a folder name
            clientAllowedFormats: ['png', 'jpeg', 'jpg'] // Optional: specify allowed formats
        }, (error, result) => {
            if (!error && result && result.event === 'success') {
                //console.log(currentVariantIndex);
                const newVariantImages = { ...uploadedVariantImages };
                newVariantImages[variantIndex] = [...(newVariantImages[variantIndex] || []), result.info.secure_url];
                setUploadedVariantImages(newVariantImages);
            }
        }).open();
    };

    useEffect(() => {
        console.log("uploadedVariantImages: ", uploadedVariantImages);
    }, [uploadedVariantImages]);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Chuẩn bị dữ liệu sản phẩm để submit
        const productToSubmit = {
            ...product,
            promotionPrice: product.buyPrice * 0.9, // Tự động tính giá khuyến mãi
            commonImages: uploadedCommonImages, // Sử dụng URL ảnh đã upload
            variants: product.variants.map((variant, index) => ({
                ...variant,
                imageUrl: uploadedVariantImages[index] || [] // Gán URL ảnh variant
            }))
        };
        try {
            // Gửi yêu cầu thêm sản phẩm
            await dispatch(addProduct(productToSubmit));

            // Reset trạng thái sau khi thêm sản phẩm
            setProduct(initialProductState);
            setUploadedCommonImages([]);
            setUploadedVariantImages({});

            // Đóng Modal và hiển thị thông báo
            handleClose();
            openGlobalSnackbar('Sản phẩm đã được thêm thành công', 'success');

            dispatch(fetchProducts());
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            openGlobalSnackbar('Lỗi khi thêm sản phẩm', 'error');
        }
    };

    // Handle adding a new variant
    const handleAddVariant = () => {
        const newVariants = [...product.variants];
        newVariants.push({ color: '', sizes: [], imageUrl: [], imageFiles: [] });
        setProduct({ ...product, variants: newVariants });
    };

    // Handle price change
    const handlePriceChange = (event) => {
        const value = event.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số
        const numberValue = parseInt(value, 10); // Chuyển đổi sang số nguyên

        if (!isNaN(numberValue) && numberValue > 0) {
            setProduct({ ...product, buyPrice: numberValue });
        } else {
            setProduct({ ...product, buyPrice: '' }); // Reset giá trị nếu không hợp lệ
        }
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };
    const textStyles = { fontFamily: 'SFUFuturaBookOblique', fontSize: '1.3em' };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="add-product-modal-title" aria-describedby="add-product-modal-description">

            <Paper elevation={3} sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', overflow: 'auto', maxHeight: '90%', width: 'auto', maxWidth: '800px', p: 2, outline: 'none' }}>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h5" sx={headerStyle} align='center' marginBottom={2}>TẠO SẢN PHẨM MỚI</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Tên Sản Phẩm"
                                name="name"
                                value={product.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Loại Sản Phẩm</InputLabel>
                                <Select
                                    name="category"
                                    value={product.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {categories.data && categories.data.map((category) => (
                                        <MenuItem key={category.id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô Tả"
                                name="description"
                                value={product.description}
                                onChange={handleInputChange}
                                multiline
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Giá bán (VNĐ)"
                                name="buyPrice"
                                value={product.buyPrice ? formatCurrency(product.buyPrice) : ''}
                                onChange={handlePriceChange}
                                type="text" // Sử dụng type="text" để có thể hiển thị định dạng tiền tệ
                                InputProps={{ inputProps: { min: 1 } }} // Đảm bảo giá trị tối thiểu là 1
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={textStyles} variant="subtitle2">Tính toán giá khuyến mãi: {formatCurrency(product.buyPrice * 0.9)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox
                                    name="isFeatured"
                                    checked={product.isFeatured}
                                    onChange={(e) => setProduct({ ...product, isFeatured: e.target.checked })}
                                />}
                                label="Đặt làm sản phẩm nổi bật"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel sx={{ ...textStyles, marginBottom: '10px' }}>Ảnh Sản Phẩm Chung</InputLabel>
                            <Button variant="outlined" onClick={() => uploadToCloudinary(true)} sx={buttonStyle}>Tải Ảnh Lên Cloud</Button>
                            {uploadedCommonImages.length > 0 && (
                                <div>
                                    <Typography variant="subtitle2" sx={textStyles}>Ảnh chung đã tải lên cloud:</Typography>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {uploadedCommonImages.map((url, index) => (
                                            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                <img src={url} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Grid>
                    </Grid>

                    {/* Variants */}
                    <Typography variant="h6" style={headerStyle} align='center'>Biến Thể Sản Phẩm</Typography>
                    {product.variants.map((variant, vIndex) => (
                        <div key={vIndex} style={{ marginTop: '10px', border: '1px solid #ddd', padding: '10px' }}>
                            <Typography variant="subtitle1" sx={textStyles}>Biến thể {vIndex + 1}</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label={`Màu sắc`}
                                        name={`color`}
                                        value={variant.color}
                                        onChange={(e) => handleVariantChange(vIndex, e)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel sx={{ ...textStyles, marginBottom: '10px' }}>Ảnh Biến Thể Sản Phẩm</InputLabel>
                                    <Button variant="outlined" onClick={() => openVariantImageUploadWidget(vIndex)} sx={buttonStyle}>Tải Ảnh Lên Cloud</Button>
                                    {uploadedVariantImages[vIndex] && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {uploadedVariantImages[vIndex].map((url, index) => (
                                                <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                    <img src={url} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" sx={textStyles}>Kích Cỡ:</Typography>
                                    {SIZE_OPTIONS.map((size) => (
                                        <Grid container key={size} spacing={2}>
                                            <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={variant.sizes.some((s) => s.size === size)}
                                                            onChange={(e) =>
                                                                handleSizeSelection(vIndex, size, e.target.checked)
                                                            }
                                                        />
                                                    }
                                                    label={size}
                                                />
                                            </Grid>
                                            {variant.sizes.some((s) => s.size === size) && (
                                                <>
                                                    <Grid item xs={4}>
                                                        <TextField
                                                            label="Số lượng"
                                                            type="number"
                                                            fullWidth
                                                            value={
                                                                variant.sizes.find((s) => s.size === size)
                                                                    ? variant.sizes.find((s) => s.size === size).amount
                                                                    : ''
                                                            }
                                                            onChange={(e) =>
                                                                handleSizeAmountChange(
                                                                    vIndex,
                                                                    size,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body2" sx={textStyles}>
                                                            {variant.sizes.find((s) => s.size === size)
                                                                ? variant.sizes.find((s) => s.size === size).isInStock
                                                                    ? 'Còn Hàng'
                                                                    : 'Hết Hàng'
                                                                : ''}
                                                        </Typography>
                                                    </Grid>
                                                </>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </div>
                    ))}

                    <Button type="button" variant="contained" onClick={handleAddVariant} style={{ ...buttonStyle, marginTop: '10px' }}>
                        <AddIcon />Thêm Biến Thể
                    </Button>
                    <br />
                    <br />
                    <Box align='center'>
                        <Button type="submit" variant="contained" color="primary" sx={{ ...buttonStyle, mt: 2 }}>
                            Tạo Sản Phẩm
                        </Button>
                    </Box>

                </form>
            </Paper>
        </Modal>
    );
};

export default AddProductModal;
