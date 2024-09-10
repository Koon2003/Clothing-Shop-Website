import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductItem = ({ product, category }) => {
    // Get the products from the store
    const { items } = useSelector((state) => state.products);

    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (category) {
            const filtered = items && items.data && Array.isArray(items.data)
                ? items.data.filter((item) => item.category === category)
                : [];
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(product && typeof product === 'object' ? [product] : []);
        }
    }, [items, category, product]);

    // If there are no products, return null
    if (!filteredProducts.length) return null;

    const isLessThanFourProducts = filteredProducts.length < 4;

    // Format the price
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <Grid container spacing={6} sx={{
            display: isLessThanFourProducts ? 'flex' : undefined,
            justifyContent: isLessThanFourProducts ? 'center' : undefined,
            alignItems: isLessThanFourProducts ? 'center' : undefined,
            minHeight: isLessThanFourProducts ? 'auto' : undefined // Adjust the height to fill the screen
        }}>
            {filteredProducts.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4} lg={3} sx={{
                    display: 'flex',
                    justifyContent: 'center' // Center each card
                }}>
                    <Card
                        sx={{
                            position: 'relative',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: '280px',
                            boxSizing: 'border-box',
                            flexGrow: 1,
                            justifyContent: 'space-between',
                            border: 'none  !important', // Remove the border
                            boxShadow: 'none',
                            borderRadius: '16px',
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
                            sx={{
                                width: '100%',
                                height: 300,
                                paddingTop: '0'
                            }}
                            image={product.commonImages[0]}
                            title={product.name}
                        />
                        <CardContent style={{ paddingBottom: '50px' }}>
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
                </Grid>
            ))
            }
        </Grid >
    );
};

export default ProductItem;
