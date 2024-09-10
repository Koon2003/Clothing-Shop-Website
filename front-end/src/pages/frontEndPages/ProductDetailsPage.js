import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, Stack, IconButton, Container, Modal } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImageIcon from '@mui/icons-material/Image';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/header/PageHeader';
import Magnifier from '../../components/common/utilities/tools/Magnifier';
import FadeInSection from '../../components/common/utilities/FadeInSection';
import ContentPhoto from '../../components/common/content/ContentPhoto';
import Footer from '../../components/common/footer/Footer';
import CartModal from '../../components/common/utilities/modal/CartModal';
import RelatedProducts from '../../components/product/RelatedProducts';
import ProductDetailsMenu from '../../components/common/utilities/ProductDetailsMenu';
import { fetchProductDetails } from '../../redux/actions/productActions';
import { addToCart } from '../../redux/actions/cartActions';

const ProductDetailPage = () => {
    // Lấy productId từ URL
    const { productId } = useParams();
    // Dispatch action để lấy chi tiết sản phẩm
    const dispatch = useDispatch();
    // Lấy thông tin sản phẩm từ store
    const { details, loading, error } = useSelector((state) => state.productDetails);
    // State để theo dõi ảnh đang được chọn
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    // State để theo dõi variant đang được chọn
    const [selectedVariant, setSelectedVariant] = useState(null);
    // State để theo dõi danh sách ảnh của sản phẩm
    const [imageList, setImageList] = useState([]);
    // State để theo dõi số lượng
    const [quantity, setQuantity] = useState(1); // Thêm state cho số lượng
    // State để theo dõi màu đã chọn
    const [selectedColor, setSelectedColor] = useState(null);
    // State để mở và đóng modal
    const [cartModalOpen, setCartModalOpen] = useState(false);
    // State để mở và đóng Snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false); // New state for Snackbar
    // State để xác định có hiển thị ảnh phóng to hay không
    const [showMagnifier, setShowMagnifier] = useState(false);

    // Lấy chi tiết sản phẩm khi productId thay đổi
    useEffect(() => {
        if (productId) {
            dispatch(fetchProductDetails(productId));
        }
    }, [dispatch, productId]);

    // Set imageList và selectedVariant khi details thay đổi
    useEffect(() => {
        if (details) {
            // Set the common images as the default image list
            setImageList(details.commonImages);
            setSelectedVariant(details.variants[0] || {});
        }
    }, [details]);

    // Hàm xử lý khi chọn ảnh trước và ảnh sau
    const handlePrevious = () => {
        setActiveImageIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : imageList.length - 1));
    };

    // Hàm xử lý khi chọn ảnh trước và ảnh sau
    const handleNext = () => {
        setActiveImageIndex(prevIndex => (prevIndex < imageList.length - 1 ? prevIndex + 1 : 0));
    };

    // Hàm xử lý khi chọn màu và hiển thị ảnh màu tương ứng
    const handleColorSelection = (variant) => {
        setSelectedVariant(variant);
        setSelectedColor(variant.color);
        if (variant && variant.imageUrl) {
           setImageList(variant.imageUrl); // Cập nhật imageList với ảnh của variant
        } else {
           setImageList(details.commonImages); // Nếu không có variant, hiển thị commonImages
        }
        setActiveImageIndex(0); // Đặt lại index ảnh
    };

    // Hàm xử lý khi chọn Reset Images
    const resetToCommonImages = () => {
        setSelectedVariant(details.variants[0] || {});
        setImageList(details.commonImages); // Reset to common images
        setActiveImageIndex(0);
    };

    // Thêm hàm xử lý thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (!selectedVariant || !selectedVariant.size || !selectedVariant.color) {
            // Nếu người dùng chưa chọn màu hoặc size, hiển thị Snackbar thông báo
            setSnackbarOpen(true);
            return;
        }

        // Tạo object itemToAdd để thêm vào giỏ hàng
        const itemToAdd = {
          product: {
            id: details._id,
            name: details.name,
            image: imageList[activeImageIndex],
            buyPrice: details.buyPrice,
            promotionPrice: details.promotionPrice,
            color: selectedVariant.color,
            size: selectedVariant.size.size,
            amount: selectedVariant.size.amount,
          },
          quantity,
        };

        // Lấy giỏ hàng hiện tại từ localStorage hoặc tạo mới nếu chưa có
        let currentCart = JSON.parse(localStorage.getItem('cart')) || []; // Cập nhật ở đây

        // Tìm vị trí của sản phẩm trong giỏ hàng, nếu tồn tại
        const existingItemIndex = currentCart.findIndex(item =>
            item.product.id === itemToAdd.product.id &&
            item.product.color === itemToAdd.product.color &&
            item.product.size === itemToAdd.product.size
        );

        // Kiểm tra xem currentCart có phải là mảng không, nếu không thì khởi tạo là mảng rỗng
        if (!Array.isArray(currentCart)) {
          currentCart = [];
        }
        if (existingItemIndex !== -1) {
          // Cập nhật số lượng của sản phẩm hiện có
          currentCart[existingItemIndex].quantity += quantity;
        } else {
          // Add the new item to the cart
          currentCart.push(itemToAdd);
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));

        // Phát sự kiện cartUpdated
        window.dispatchEvent(new Event('cartUpdated'));

        // Gọi action addToCart nếu cần cập nhật trạng thái Redux (tùy thuộc vào cách bạn quản lý trạng thái giỏ hàng trong Redux)
        dispatch(addToCart(itemToAdd));
        // Mở modal giỏ hàng
        setCartModalOpen(true);
    };

    // Function to close Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Convert the description string to an array
    const descriptionArray = details && details.description ? details.description.split("\n") : [];

    // Hàm để tạo style cho dấu X gạch chéo
    const outOfStockStyle = {
        position: 'relative',
        '&::after': {
            content: '":("',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px',
            color: 'red',
            fontWeight: 'bold',
            zIndex: 1
        }
    };

    // Format the price
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    // Format the price with larger size
    const priceStyle = {
        fontWeight: 'bold',
        fontSize: '1.5rem', // Adjust the size as needed
    };

    // Hàm tính toán phần trăm giảm giá
    const calculateDiscountPercentage = (buyPrice, promotionPrice) => {
        if (!buyPrice || !promotionPrice || promotionPrice >= buyPrice) return 0;
        return Math.round(((buyPrice - promotionPrice) / buyPrice) * 100);
    };

    // Tính phần trăm giảm giá
    const discountPercentage = details && calculateDiscountPercentage(details.buyPrice, details.promotionPrice);

    if (loading) return <Typography>Đang tải...</Typography>;
    if (error) return <Typography>Lỗi: {error}</Typography>;
    if (!details) return null;

    return (
        <>
            <Container maxWidth="xl" sx={{ mx: 'auto', overflow: 'hidden' }}>
                <PageHeader />
                <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                    {/* Left side with product images */}
                    <Grid item xs={12} sm={2} display="flex" flexDirection="column" alignItems="center">
                        {/* Thumbnail Images */}
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'row', sm: 'column' }}
                            alignItems={{ sm: 'center' }}
                            overflow="auto"
                            pr={{ sm: 2 }}
                            mb={{ xs: 2, sm: 0 }}
                            sx={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
                        >
                            {/* Thumbnail Images */}
                            {imageList.map((image, index) => (
                                <Box
                                    key={index}
                                    onClick={() => setActiveImageIndex(index)}
                                    sx={{
                                      mb: { sm: 2 },
                                      mr: { xs: 2, sm: 0 },
                                      cursor: 'pointer',
                                      border: activeImageIndex === index ? '2px solid theme.palette.primary.main' : '1px solid grey',
                                      '&:hover': {
                                        opacity: 0.8,
                                      },
                                    }}
                                >
                                    <img 
                                        src={image}
                                        alt={`${details.name} - thumbnail ${index}`}
                                        style={{ width: '75px', height: '75px', objectFit: 'cover' }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Main Image */}
                    <Grid item xs={12} sm={6} md={5} lg={5}>
                        <Box
                            sx={{
                                // Đặt maxWidth để đảm bảo hình ảnh không quá lớn và che khuất nội dung khác
                                maxWidth: '100%',
                                height: 'auto',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={() => setShowMagnifier(true)}
                            onMouseLeave={() => setShowMagnifier(false)}
                        >
                            {showMagnifier ? (
                                <Magnifier 
                                    src={imageList[activeImageIndex]}
                                    imageAlt={`${details.name}${selectedVariant ? ` - ${selectedVariant.color}` : ''}`} // alt text cho ảnh
                                    largeImageSrc={imageList[activeImageIndex]} // src của ảnh lớn để phóng to (nếu khác với src thông thường)
                                    width='100%'// Đây là kích thước bạn muốn hiển thị hình ảnh
                                    height='auto'
                                    magnifierHeight={150}
                                    magnifierWidth={150}
                                    zoomLevel={2} 
                                />
                            ) : (
                                <img 
                                    src={imageList[activeImageIndex]}
                                    alt={`${details.name}${selectedVariant ? ` - ${selectedVariant.color}` : ''}`}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            )}
                            <IconButton onClick={handlePrevious} sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}>
                                <ArrowBackIosIcon />
                            </IconButton>
                            <IconButton onClick={handleNext} sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}> 
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Right side with product information */}
                    <Grid item xs={12} sm={5}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            sx={{ height: '100%' }}
                        >
                            <Typography variant="h3" my={2} sx={{ fontFamily: 'SFUFuturaBookOblique' }}>{details.name}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                                <Typography variant="body2" sx={{
                                    ...priceStyle,
                                    textDecoration: 'line-through',
                                    color: 'text.secondary',
                                    marginRight: '8px',
                                    paddingBottom: '10px',
                                    fontSize: '1.2rem'
                                }}>
                                    {formatPrice(details.buyPrice)}
                                </Typography>
                                <Typography variant="body2" color="error" component="p" sx={{
                                    ...priceStyle,
                                    fontWeight: 'bold',
                                    paddingBottom: '10px',
                                    fontSize: '2rem'
                                }}>
                                    {formatPrice(details.promotionPrice)}
                                </Typography>
                                {discountPercentage > 0 && (
                                    <Typography sx={{ ml: 2, color: 'green' }}>
                                        Giảm {discountPercentage}%
                                    </Typography>
                                )}
                            </Box>
                            {/* Render color buttons */}
                            <Stack direction="row" spacing={1} mb={2}>
                                {details.variants.map((variant) => (
                                    <Button
                                        key={variant.color}
                                        variant={selectedVariant?.color === variant.color ? 'contained' : 'outlined'}
                                        style={{ backgroundColor: variant.color }}
                                        onClick={() => handleColorSelection(variant)}
                                        disabled={variant.sizes.every(size => size.amount === 0)} // Disable nếu tất cả size đều hết hàng
                                        sx={variant.sizes.every(size => size.amount === 0) ? outOfStockStyle : {}}
                                    >
                                    </Button>
                                ))}
                                <IconButton
                                    onClick={resetToCommonImages}
                                    sx={{
                                        backgroundColor: 'transparent',
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            color: 'white',
                                        },
                                    }}
                                    aria-label="Ảnh Chung"
                                >
                                    <ImageIcon sx={{ color: 'black' }} />
                                </IconButton>
                            </Stack>
                            {/* Render sizes of the selected variant or default sizes */}
                            <Stack direction="row" spacing={1}>
                                {(selectedVariant ? selectedVariant.sizes : details.variants[0].sizes).map((size) => (
                                    <Button
                                        key={size.size}
                                        variant={selectedVariant?.size === size ? 'text' : 'outlined'}
                                        disabled={!selectedColor || size.amount === 0} // Disable nếu chưa chọn màu hoặc hết hàng
                                        onClick={() => setSelectedVariant({ ...selectedVariant, size })}
                                        sx={{
                                            ...(size.amount === 0 ? outOfStockStyle : {}),
                                            ...(selectedVariant?.size === size ? {
                                              backgroundColor: 'black',
                                              color: 'white',
                                              '&:hover': {
                                                backgroundColor: 'grey',
                                                borderColor: 'grey',
                                              },
                                              borderColor: 'grey',
                                            } : {
                                              backgroundColor: 'transparent',
                                              color: 'black',
                                              '&:hover': {
                                                backgroundColor: 'transparent',
                                                borderColor: 'black',
                                              },
                                              borderColor: 'black',
                                            })
                                        }}
                                    >
                                        {size.size}
                                    </Button>
                                ))}
                            </Stack>
                            {/* Add to cart and other actions */}
                            <Stack direction="row" spacing={1} alignItems="center" my={2}>
                                <Button onClick={() => setQuantity(q => Math.max(q - 1, 1))}>-</Button>
                                <Typography>{quantity}</Typography>
                                <Button onClick={() => setQuantity(q => q + 1)}>+</Button>
                                <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'grey' } }} onClick={handleAddToCart}>
                                    Thêm Vào Giỏ Hàng
                                </Button>
                            </Stack>
                            {/* ... */}
                            <ProductDetailsMenu descriptionArray={descriptionArray} />
                        </Box>
                    </Grid>
                </Grid>

                <FadeInSection><RelatedProducts productId={productId}/></FadeInSection>

                {/* Modal hiển thị thông tin giỏ hàng */}
                <Modal
                    open={cartModalOpen}
                    onClose={() => setCartModalOpen(false)}
                    aria-labelledby="cart-modal-title"
                >
                    <Box>
                        {/* Nội dung modal, bạn có thể truyền props nếu cần */}
                        <CartModal onClose={() => setCartModalOpen(false)} />
                    </Box>
                </Modal>
                {/* Add Snackbar to show alerts */}
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                        Vui lòng chọn Màu và Size trước khi thêm vào giỏ hàng!
                    </Alert>
                </Snackbar>
            </Container>
            <FadeInSection><ContentPhoto /></FadeInSection>
            <Footer />
        </>
    );
};

export default ProductDetailPage;