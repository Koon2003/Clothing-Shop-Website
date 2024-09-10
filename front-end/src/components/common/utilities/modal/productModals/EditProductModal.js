import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    Modal,
    Paper,
    TextField,
    Typography,
    Select,
    MenuItem,
    DialogTitle,
    Snackbar
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { fetchCategories } from '../../../../../redux/actions/categoryActions';
import { deleteCommonImages, deleteVariant, deleteVariantImages, fetchProducts, updateProduct } from '../../../../../redux/actions/productActions';
import slugify from 'slugify';
import MuiAlert from '@mui/material/Alert';

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];


const EditProductModal = ({ open, handleClose, productData, openGlobalSnackbar }) => {
    // Get dispatch function from redux store
    const dispatch = useDispatch();
    // Local state
    const categories = useSelector((state) => state.category.categories);
    const [product, setProduct] = useState({ ...productData });

    const [isFeatured, setIsFeatured] = useState(productData.isFeatured);

    const [showNewVariantSection, setShowNewVariantSection] = useState(false);
    const [newVariant, setNewVariant] = useState({
        color: '',
        sizes: SIZE_OPTIONS.map(size => ({ size, amount: 0 })),
        imageUrl: [],
        tempImageUrl: [] // Thêm trường này
    });

    const [tempCommonImages, setTempCommonImages] = useState([]);
    const [tempVariantImages, setTempVariantImages] = useState({});

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' hoặc 'error'

    // Fetch categories when the modal is opened
    useEffect(() => {
        if (open) {
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
                    const cloudinaryWidget = window.cloudinary.createUploadWidget(
                        {
                            cloudName: "dtprxjb8e",
                            uploadPreset: "clothing-image",
                        },
                        (error, result) => {
                            if (!error && result && result.event === "success") {
                                console.log('Upload successful! Here is the image info: ', result.info);
                                // Bạn có thể xử lý kết quả tải lên tại đây
                            }
                        }
                    );
    
                    // Ensure the button exists before adding an event listener
                    const uploadButton = document.getElementById('upload_widget_button');
                    if (uploadButton) {
                        uploadButton.addEventListener('click', () => {
                            cloudinaryWidget.open();
                        }, false);
                    } else {
                        console.error("Upload widget button not found.");
                    }
                } else {
                    console.error("Cloudinary script not loaded");
                }
            };

            loadCloudinaryScript();
            dispatch(fetchCategories());
        }
    }, [open, dispatch]);

    // Set initial product data
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    };

    // Hàm xử lý khi thay đổi trạng thái isFeatured
    const handleIsFeaturedChange = (event) => {
        setIsFeatured(event.target.checked);
    };

    // Hàm xử lý khi click vào nút Add Variant
    const handleAddVariantClick = () => {
        // When adding a new variant, we show the new variant section with empty fields
        setShowNewVariantSection(true);
    };

    // Hàm mở snackbar
    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    // Hàm xử lý khi thay đổi input của newVariant
    const handleNewVariantChange = (event) => {
        const { name, value } = event.target;
        setNewVariant({ ...newVariant, [name]: value });
    };

    // Hàm xóa dấu tiếng Việt (hoặc bất kỳ ngôn ngữ có dấu khác)
    const removeDiacritics = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    // Hàm tạo slug tạm thời cho newVariant
    const createTemporarySlug = (productName, color) => {
        const slug = removeDiacritics(`${productName}-${color}`);
        return slugify(slug, { lower: true, strict: true });
    };

    // Hàm upload ảnh cho newVariant
    const handleNewVariantImageUpload = () => {
        const variantSlug = createTemporarySlug(product.name, newVariant.color); // Tạo slug tạm thời dựa trên tên sản phẩm và màu sắc của biến thể mới
        uploadImageToCloudinary(false, variantSlug); // Gọi hàm uploadImageToCloudinary với isCommon là false và truyền variantSlug
    };

    // Hàm xóa ảnh tạm thời của newVariant
    const removeTempNewVariantImage = (index) => {
        const updatedImages = [...newVariant.tempImageUrl];
        updatedImages.splice(index, 1);
        setNewVariant({ ...newVariant, tempImageUrl: updatedImages });
    };

    // Hàm xử lý khi thay đổi số lượng size của newVariant
    const handleNewVariantSizeChange = (size, amount) => {
        setNewVariant({
            ...newVariant,
            sizes: newVariant.sizes.map(s =>
                s.size === size ? { ...s, amount: Number(amount) } : s
            )
        });
    };

    // Hàm xử lý khi click vào nút Save New Variant
    const handleSaveNewVariant = async () => {
        const newVariantData = {
            ...newVariant,
            imageUrl: [...newVariant.tempImageUrl]
        };
        setProduct({
            ...product,
            variants: [...product.variants, newVariantData]
        });
        setShowNewVariantSection(false);
        setNewVariant({
            color: '',
            sizes: SIZE_OPTIONS.map(size => ({ size, amount: 0 })),
            imageUrl: [],
            tempImageUrl: []
        });
    };

    // Hàm xử lý khi click vào checkbox của size
    const handleSizeSelection = (variantIndex, size) => {
        const updatedVariants = product.variants.map((variant, idx) => {
            if (idx === variantIndex) {
                const sizeIndex = variant.sizes.findIndex(s => s.size === size);
                if (sizeIndex >= 0) {
                    variant.sizes.splice(sizeIndex, 1); // Remove size if it exists
                } else {
                    variant.sizes.push({ size, amount: 0 }); // Add size if it doesn't exist
                }
            }
            return variant;
        });
        setProduct({ ...product, variants: updatedVariants });
    };

    // Hàm xử lý khi thay đổi số lượng size của variant
    const handleSizeAmountChange = (variantIndex, size, amount) => {
        const updatedVariants = product.variants.map((variant, idx) => {
            if (idx === variantIndex) {
                const sizeObj = variant.sizes.find(s => s.size === size);
                if (sizeObj) {
                    sizeObj.amount = amount;
                }
            }
            return variant;
        });
        setProduct({ ...product, variants: updatedVariants });
    };

    // Hàm xử lý khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the color field of the new variant is provided
        if (showNewVariantSection && !newVariant.color) {
            alert("Please provide a color for the new variant.");
            return;
        }

        // Generate slug for new variant if it is being added
        let finalNewVariantSlug = '';
        if (showNewVariantSection) {
            finalNewVariantSlug = createTemporarySlug(product.name, newVariant.color);
        }

        const updatedProduct = {
            ...product,
            commonImages: [...product.commonImages, ...tempCommonImages],
            variants: [
                ...product.variants.map(variant => ({
                    ...variant,
                    imageUrl: variant.imageUrl.concat(tempVariantImages[variant.slug] || [])
                })),
                ...(showNewVariantSection ? [{ ...newVariant, slug: finalNewVariantSlug }] : [])
            ],
            isFeatured: isFeatured, // Include the isFeatured field
        };

        try {
            await dispatch(updateProduct(updatedProduct._id, updatedProduct));

            // Đóng modal
            handleClose();
            openGlobalSnackbar('Sản phẩm đã được cập nhật', 'success');

            // Sau khi cập nhật thành công, gọi lại fetchProducts để cập nhật danh sách sản phẩm
            dispatch(fetchProducts());
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            openGlobalSnackbar('Lỗi khi cập nhật sản phẩm', 'error');
        }
    };

    // Hàm upload ảnh lên Cloudinary
    const uploadImageToCloudinary = (isCommon, variantSlug = null) => {
        const cloudName = `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`; // Replace with your Cloudinary cloud name
        const uploadPreset = `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`; // Replace with your Cloudinary upload preset
        const folderPath = isCommon ? 'uploads/editProducts/commonImages' : `uploads/editProducts/variants/${variantSlug}`;

        window.cloudinary.openUploadWidget({
            cloudName,
            uploadPreset,
            sources: ['local', 'url', 'camera'],
            folder: folderPath,
            multiple: true,
            maxFiles: 5,
            cropping: false,
            clientAllowedFormats: ['png', 'jpeg', 'jpg']
        }, (error, result) => {
            if (!error && result && result.event === 'success') {
                if (isCommon) {
                    setTempCommonImages((prevImages) => [...prevImages, result.info.secure_url]);
                } else {
                    setTempVariantImages((prevImages) => ({
                        ...prevImages,
                        [variantSlug]: [...(prevImages[variantSlug] || []), result.info.secure_url]
                    }));
                }
            }
        });
    };

    // Hàm upload ảnh cho commonImages
    const handleCommonImageUpload = () => {
        uploadImageToCloudinary(true);
    };

    // Hàm upload ảnh cho variantImages
    const handleVariantImageUpload = (variantSlug) => {
        uploadImageToCloudinary(false, variantSlug);
    };

    // Hàm xóa ảnh tạm thời của commonImages
    const removeTempCommonImage = (index) => {
        const updatedImages = [...tempCommonImages];
        updatedImages.splice(index, 1);
        setTempCommonImages(updatedImages);
    };

    // Hàm xóa ảnh tạm thời của variantImages
    const removeTempVariantImage = (variantSlug, imageIndex) => {
        const updatedVariantImages = {
            ...tempVariantImages,
            [variantSlug]: [...tempVariantImages[variantSlug]]
        };
        updatedVariantImages[variantSlug].splice(imageIndex, 1);
        setTempVariantImages(updatedVariantImages);
    };

    // Hàm xóa ảnh commonImages
    const handleDeleteCommonImage = (imageUrl) => {
        const updatedImages = product.commonImages.filter(img => img !== imageUrl);
        dispatch(deleteCommonImages(product._id, updatedImages))
            .then(() => {
                openSnackbar('Xóa ảnh chung thành công', 'success');
            })
            .catch((error) => {
                openSnackbar('Lỗi khi xóa ảnh chung', 'error');
            });
        setProduct({ ...product, commonImages: updatedImages });
    };


    // Hàm xóa variantImages của sản phẩm
    const handleDeleteVariantImage = (variantSlug, imageUrl) => {
        const variantIndex = product.variants.findIndex(variant => variant.slug === variantSlug);
        if (variantIndex >= 0) {
            const updatedImages = product.variants[variantIndex].imageUrl.filter(img => img !== imageUrl);
            const updatedVariants = [...product.variants];
            updatedVariants[variantIndex] = { ...updatedVariants[variantIndex], imageUrl: updatedImages };
            dispatch(deleteVariantImages(product._id, variantSlug, updatedImages))
                .then(() => {
                    openSnackbar('Xóa ảnh biến thể thành công', 'success');
                })
                .catch((error) => {
                    openSnackbar('Lỗi khi xóa ảnh biến thể', 'error');
                });
            setProduct({ ...product, variants: updatedVariants });
        }
    };


    // Hàm xóa variant của sản phẩm
    const handleDeleteVariant = (variantSlug) => {
        const updatedVariants = product.variants.filter(variant => variant.slug !== variantSlug);
        dispatch(deleteVariant(product._id, variantSlug))
            .then(() => {
                openSnackbar('Xóa biến thể thành công', 'success');
            })
            .catch((error) => {
                openSnackbar('Lỗi khi xóa biến thể', 'error');
            });
        setProduct({ ...product, variants: updatedVariants });
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };
    const textStyles = { fontFamily: 'SFUFuturaBookOblique', fontSize: '1.3em' };


    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="edit-product-modal-title"
                aria-describedby="edit-product-modal-description"
                style={{
                    position: 'absolute', // Đảm bảo Modal không bị mất khỏi màn hình
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    overflowY: 'auto',
                    width: '70%',
                    maxWidth: '90%',
                    height: '70%',
                }}
            >
                <Paper elevation={3} style={{ padding: '10px', maxWidth: '100%', width: '100%', outline: 'ActiveBorder' }}>
                    <IconButton style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    <DialogTitle variant="h5" sx={headerStyle} align='center'>SỬA SẢN PHẨM</DialogTitle>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Tên Sản Phẩm"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Mô Tả"
                                    name="description"
                                    value={product.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Loại Sản Phẩm</InputLabel>
                                    <Select
                                        name="category"
                                        value={product.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {categories.data && categories.data.map((category) => (
                                            <MenuItem key={category._id} value={category._id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isFeatured}
                                            onChange={handleIsFeaturedChange}
                                            name="isFeatured"
                                            color="primary"
                                        />
                                    }
                                    label="Đặt làm sản phẩm nổi bật"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Giá Bán</InputLabel>
                                <TextField
                                    fullWidth
                                    name="buyPrice"
                                    type="number"
                                    value={product.buyPrice}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Giá Khuyến Mãi</InputLabel>
                                <TextField
                                    fullWidth
                                    name="promotionPrice"
                                    type="number"
                                    value={product.promotionPrice}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={textStyles}>Ảnh Sản Phẩm Chung</Typography>
                                <Button variant="contained" onClick={handleCommonImageUpload} sx={buttonStyle}>Tải Ảnh Lên Cloud</Button>
                                <div>
                                    {[...product.commonImages, ...tempCommonImages].map((imageUrl, index) => (
                                        <div key={imageUrl} style={{ display: 'inline-block', margin: '5px' }}>
                                            <img src={imageUrl} alt={`Common ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                            {index >= product.commonImages.length && (
                                                <div>
                                                    <IconButton size="small" onClick={() => handleDeleteCommonImage(imageUrl)}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => removeTempCommonImage(index - product.commonImages.length)}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={headerStyle} align='center'>Biến Thể Sản Phẩm</Typography>
                                {product.variants.map((variant, index) => (
                                    <div key={variant._id || `${variant.color}-${index}`}>
                                        <Typography variant="subtitle1" sx={textStyles}>Màu sắc: {variant.color}</Typography>
                                        <div>
                                            <Typography variant="subtitle1" sx={textStyles}>Kích Cỡ:</Typography>
                                            {SIZE_OPTIONS.map((size) => (
                                                <FormControlLabel
                                                    key={size}
                                                    control={
                                                        <Checkbox
                                                            checked={variant.sizes.some(
                                                                (s) => s.size === size
                                                            )}
                                                            onChange={() =>
                                                                handleSizeSelection(index, size)
                                                            }
                                                        />
                                                    }
                                                    label={size}
                                                />
                                            ))}
                                        </div>
                                        <div>
                                            <Typography variant="subtitle1" sx={textStyles}>
                                                Số lượng:
                                            </Typography>
                                            {variant.sizes.map((sizeObj) => (
                                                <TextField
                                                    key={`${index}-${sizeObj.size}`}
                                                    label={sizeObj.size}
                                                    type="number"
                                                    value={sizeObj.amount}
                                                    onChange={(e) =>
                                                        handleSizeAmountChange(
                                                            index,
                                                            sizeObj.size,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <Typography variant="h6" sx={{...textStyles, marginTop: '20px', marginBottom: '10px'}}>Ảnh Biến Thể Sản Phẩm</Typography>
                                        <Button variant="contained" onClick={() => handleVariantImageUpload(variant.slug)} sx={buttonStyle}>Tải Ảnh Lên Cloud</Button>
                                        <div>
                                            {variant.imageUrl.concat(tempVariantImages[variant.slug] || []).map((imageUrl, imgIndex) => (
                                                <div key={imgIndex} style={{ display: 'inline-block', margin: '5px' }}>
                                                    <img src={imageUrl} alt={`Variant ${imgIndex + 1}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                    {imgIndex >= variant.imageUrl.length && (
                                                        <div>
                                                            <IconButton size="small" onClick={() => handleDeleteVariantImage(variant.slug, imageUrl, index)}>
                                                                <CloseIcon />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => removeTempVariantImage(variant.slug, imgIndex - variant.imageUrl.length)}>
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <Button onClick={() => handleDeleteVariant(variant.slug, index)}>Xóa Biến Thể</Button>
                                    </div>
                                ))}
                                {showNewVariantSection && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" sx={textStyles}>Thêm Biến Thể Mới</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Màu sắc"
                                                name="color"
                                                value={newVariant.color}
                                                onChange={handleNewVariantChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Button variant="contained" onClick={handleNewVariantImageUpload} sx={buttonStyle}>Tải Ảnh Lên Cloud</Button>
                                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {newVariant.tempImageUrl.map((imageUrl, index) => (
                                                    <div key={imageUrl} style={{ display: 'inline-block', margin: '5px' }}>
                                                        <img src={imageUrl} alt={`New Variant ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                        <IconButton size="small" onClick={() => removeTempNewVariantImage(index)}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </div>
                                                ))}
                                            </div>
                                        </Grid>
                                        {SIZE_OPTIONS.map(size => (
                                            <Grid item xs={6} sm={2} key={size}>
                                                <TextField
                                                    fullWidth
                                                    label={size}
                                                    name={size}
                                                    type="number"
                                                    value={newVariant.sizes.find(s => s.size === size).amount}
                                                    onChange={(e) => handleNewVariantSizeChange(size, e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                        ))}
                                        <Grid item xs={12}>
                                            <Button onClick={handleSaveNewVariant} sx={buttonStyle}>Lưu Biến Thể Mới</Button>
                                        </Grid>
                                    </Grid>
                                )}

                                <Button onClick={handleAddVariantClick} sx={{...buttonStyle, marginTop: '20px'}}>Thêm Biến Thể Mới</Button>
                            </Grid>
                            <Grid item xs={12} align='center'>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={buttonStyle}
                                >
                                    Lưu
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleClose}
                                >
                                    Hủy
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Modal>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => {
                    setSnackbarOpen(false);
                }}
            >
                <Alert
                    onClose={() => {
                        setSnackbarOpen(false);
                    }}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditProductModal;
