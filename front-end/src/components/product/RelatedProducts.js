import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardMedia, Box, CardContent, Typography } from '@mui/material';
import { fetchRelatedProducts } from '../../redux/actions/productActions';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ productId }) => {
  // Get the products from the store
  const dispatch = useDispatch();
  const { relatedItems, loading, error } = useSelector((state) => state.relatedProducts);

  // Fetch related products
  useEffect(() => {
    dispatch(fetchRelatedProducts(productId));
  }, [dispatch, productId]);


  if (loading) return <Typography>Đang tải sản phẩm liên quan...</Typography>;
  if (error) return <Typography>Lỗi khi tải sản phẩm liên quan: {error}</Typography>;

  // Xác định justifyContent dựa trên số lượng sản phẩm liên quan
  const justifyContent = relatedItems.length < 3 ? 'center' : 'flex-start';

  return (
    <>
      <Box textAlign="center" my={4}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ paddingTop: '50px', paddingBottom: '30px', fontFamily: 'SFUFuturaBookOblique' }}
        >
          SẢN PHẨM LIÊN QUAN
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent={justifyContent}>
        {relatedItems.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
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
                paddingBottom: '50px'
              }}>
              <CardMedia
                sx={{
                  width: '100%',
                  height: 400,
                  paddingTop: '0'
                }}
                image={product.commonImages[0]}
                alt={product.name}
              />
              <CardContent>
                <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    textAlign: 'center', // Center text horizontally
                    width: '100%',
                    pt: '20px',
                    fontFamily: 'SFUFuturaBookOblique',
                    color: 'black',
                    fontSize: '1.4rem'
                  }}>
                    {product.name}
                  </Typography>
                </Link>
                <Box mt={1}
                  display="flex"
                  justifyContent="center"
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
        ))}
      </Grid>
    </>
  );
};

export default RelatedProducts;
