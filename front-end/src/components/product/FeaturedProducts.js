import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import { fetchFeaturedProducts } from '../../redux/actions/productActions';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // Import Slider component

// Import the CSS files for slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeaturedProducts = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector(state => state.featuredProducts);

    useEffect(() => {
        dispatch(fetchFeaturedProducts());
    }, [dispatch]);

    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true, // Enable auto-play
        autoplaySpeed: 3000, // Slide interval in milliseconds
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    // Format the price
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ padding: 3, width: '100%', textAlign: 'center' }}> {/* Center the title */}
            <Typography variant="h3" gutterBottom sx={{ paddingTop: '10px', paddingBottom: '30px', fontFamily: 'SFUFuturaBookOblique' }}>
                Sản Phẩm Nổi Bật
            </Typography>
            <Slider {...settings}>
                {items.map(product => (
                    <div key={product._id} style={{ padding: '20px' }}>
                        <Card raised sx={{
                            position: 'relative', // Add this line
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '300px',
                            maxHeight: "auto",
                            border: '0', 
                            paddingBottom: '30px',
                        }}>
                            <Chip label="SALE" size="small"
                                sx={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    zIndex: 1, // Ensure it's above other elements
                                    backgroundColor: 'red',
                                    color: 'white',
                                }}
                            />
                            <CardMedia
                                component="img"
                                sx={{
                                    height: '400px',
                                    objectFit: 'cover'
                                }}
                                image={product.commonImages[0]}
                                alt={product.name}
                            />
                            <CardContent sx={{
                                flexGrow: 1,
                                overflow: 'hidden',
                                display: 'flex', // Enable flexbox
                                flexDirection: 'column', // Stack children vertically
                                justifyContent: 'center', // Center children vertically in the container
                                alignItems: 'center', // Center children horizontally in the container
                                textAlign: 'center', // Center text
                            }}>
                                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                                    <Typography gutterBottom variant="h6" component="h2" sx={{
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        textAlign: 'center', // Center text horizontally
                                        width: '100%',
                                        pt: '20px',
                                        color: 'black',
                                        fontFamily: 'SFUFuturaBookOblique',
                                        fontSize: '1.4rem'
                                    }}>
                                        {product.name}
                                    </Typography>
                                </Link>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{
                                        textDecoration: 'line-through',
                                        color: 'text.secondary',
                                        marginRight: '8px'
                                    }}>
                                        {formatPrice(product.buyPrice)}
                                    </Typography>
                                    <Typography variant="body2" color="error" component="p" sx={{
                                        fontWeight: 'bold', fontSize: '1.1rem'
                                    }}>
                                        {formatPrice(product.promotionPrice)}
                                    </Typography>
                                </Box>
                                <Box
                                    mt={1}
                                    display="flex"
                                    justifyContent="center" // This will center the color circles container
                                >
                                    {product.variants.map(variant => (
                                        <Box
                                            key={variant.color}
                                            sx={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: '50%',
                                                backgroundColor: variant.color,
                                                display: 'inline-block',
                                                marginLeft: 0.5, // Space between circles
                                                border: '1px solid',
                                                borderColor: 'text.primary'
                                            }}
                                        />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </Slider>
        </Box>
    );
};

export default FeaturedProducts;
