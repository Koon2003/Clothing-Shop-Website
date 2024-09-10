import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { fetchProducts } from '../../redux/actions/productActions';
import ProductItem from './ProductItem';

const HoodieJackets = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                style={{ paddingTop: '20px', paddingBottom: '30px', fontFamily: 'SFUFuturaBookOblique'}}
            >
                ÁO KHOÁC HOODIE
            </Typography>
            <ProductItem category="ao-hoodie" />
        </div>

    );
};

export default HoodieJackets;
