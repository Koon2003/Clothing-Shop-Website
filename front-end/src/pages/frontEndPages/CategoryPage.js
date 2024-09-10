import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, Container } from '@mui/material';
import ProductItem from '../../components/product/ProductItem';
import { fetchCategoryProducts } from '../../redux/actions/productActions';
import PageHeader from '../../components/common/header/PageHeader';
import ContentPhoto from '../../components/common/content/ContentPhoto';
import FeaturedProducts from '../../components/product/FeaturedProducts';
import Footer from '../../components/common/footer/Footer';
import FadeInSection from '../../components/common/utilities/FadeInSection';


const CategoryPage = () => {
    // Lấy categoryId từ URL
    const { categoryId } = useParams();
    const dispatch = useDispatch();

    // Lấy dữ liệu sản phẩm từ store
    const { products, loading, error, categoryName } = useSelector(state => state.categoryProducts);

    // Lấy dữ liệu sản phẩm theo danh mục
    useEffect(() => {
        dispatch(fetchCategoryProducts(categoryId));
    }, [dispatch, categoryId]);

    // Nếu đang tải dữ liệu, hiển thị thông báo
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Container maxWidth="auto" sx={{ mx: 'auto', padding: '10px' }}>
                <PageHeader />
                <Typography variant="h4" align="center" style={{ padding: '10px', fontFamily: 'SFUFuturaBookOblique' }} gutterBottom>
                    {categoryName ? categoryName.toUpperCase() : 'CATEGORY'}
                </Typography>
                <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                    {products.map(product => (
                        <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}> {/* Đảm bảo rằng mỗi sản phẩm chiếm đúng không gian */}
                            <ProductItem product={product} />
                        </Grid>
                    ))}
                </Grid>
            </Container >
            <FadeInSection><FeaturedProducts /></FadeInSection>
            <FadeInSection><ContentPhoto /></FadeInSection>
            <Footer />
        </>
    );
};

export default CategoryPage;