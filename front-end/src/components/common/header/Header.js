import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import Logo from "./headerComponents/Logo";
import MenuItems from "./headerComponents/MenuItems";
import SearchAndCart from "./headerComponents/SearchAndCart";

const Header = ({ style }) => (
  <>
    <AppBar
      position="absolute"
      sx={{
        top: "35px",
        background:
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))", // Đây là màu nền trong suốt
        boxShadow: "none",
        border: "none",
        color: "white", // Đặt màu cho các text và icons nếu cần,
        zIndex: 1100, // Đảm bảo Header nằm trên cùng
      }}
    >
      <Toolbar>
        <Logo
          imagePath="https://res.cloudinary.com/dzqcoirgm/image/upload/v1706084821/TAN_Boutique/Logo/logo_tan_Tr%E1%BA%AFng_q33ntn.png"
          color="white"
        />
        <MenuItems textColor="white"/>
        <SearchAndCart color="white"/>
      </Toolbar>
    </AppBar>
  </>
);

export default Header;
