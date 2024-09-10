import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../../redux/actions/productActions';
import { Grid, Container} from '@mui/material';
import ProductItem from '../../components/product/ProductItem';
import PageHeader from '../../components/common/header/PageHeader';

const SearchPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const { items, loading, error } = useSelector(state => state.products);

    useEffect(() => {
        dispatch(searchProducts(query));
    }, [dispatch, query]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!items || !items.data || !items.data.length) return <div>No results found for '{query}'</div>;

    return (
        <Container maxWidth="auto" sx={{ mx: 'auto' }}> {/* maxWidth có thể là lg, md, sm tùy vào kích thước bạn muốn */}
            <PageHeader/>
            <h2>Kết quả tìm kiếm cho '{query}':</h2>
            <Grid container spacing={2}>
                {items.data.map(product => (
                    <Grid item key={product._id} xs={12} sm={6} md={4}>
                        <ProductItem product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default SearchPage;
