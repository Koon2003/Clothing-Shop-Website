import React from 'react';
import { AppBar, Toolbar, IconButton, Box, Badge } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Logo from './headerComponents/Logo';
import { useNavigate } from 'react-router-dom';

const CheckOutHeader = () => {
    const navigate = useNavigate();

    const handleCartClick = () => {
        navigate('/cart');
    };
    return (

        <AppBar position="static" sx={{ backgroundColor: 'black' }}>
            <Toolbar>
                <IconButton color="inherit">
                    <Badge
                        color="secondary"
                        onClick={handleCartClick}
                        sx={{ cursor: 'pointer' }}
                    >
                        <ShoppingBagIcon />
                    </Badge>
                </IconButton>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    <Logo imagePath="https://res.cloudinary.com/dzqcoirgm/image/upload/v1706084821/TAN_Boutique/Logo/logo_tan_Tr%E1%BA%AFng_q33ntn.png" color="white" />
                </Box>
            </Toolbar>
        </AppBar>
    );

};

export default CheckOutHeader;
