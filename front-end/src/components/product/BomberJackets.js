import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { fetchProducts } from '../../redux/actions/productActions';
import ProductItem from './ProductItem';

const BomberJackets = () => {
    const dispatch = useDispatch();

    // Fetch products
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
                ÁO KHOÁC BOMBER
            </Typography>
            <ProductItem category="ao-khoac-bomber" />
        </div>

    );
};

export default BomberJackets;