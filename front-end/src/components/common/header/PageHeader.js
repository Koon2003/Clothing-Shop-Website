import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import MenuItems from "./headerComponents/MenuItems";
import Logo from './headerComponents/Logo';
import SearchAndCart from './headerComponents/SearchAndCart';

const PageHeader = () => (
    <>
        <AppBar
            position="static"
            sx={{
                top: '35px',
                background: 'white', // Đây là màu nền trong suốt
                boxShadow: 'none',
                border: 'none',
                color: 'black', // Đặt màu cho các text và icons nếu cần,
            }}>
            <Toolbar>
                <Logo imagePath="https://github.com/goldenpig17/TAN_Images/blob/main/Logo/%C4%90EN.png?raw=true" color="black" />
                <MenuItems textColor="black" />
                <SearchAndCart color="black" />
            </Toolbar>
        </AppBar>
    </>
)

export default PageHeader;