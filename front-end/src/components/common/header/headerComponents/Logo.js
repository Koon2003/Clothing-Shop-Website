import React from "react";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Logo = ({ imagePath, color }) => {
  const navigate = useNavigate();

  // Điều hướng đến trang chủ khi click vào logo
  const handleLogoClick = () => {
    navigate("/");
  };

  // Blinking animation keyframes
  const blinkAnimation = `@keyframes blink {
        50% { opacity: 0; }
      }`;

  // Style cho Typography
  const typographyStyle = {
    fontFamily: "SFUFuturaBook, Arial",
  };

  // Style cho logo image
  const logoImageStyle = {
    height: "89px", // Tăng kích thước logo
    // Thêm các thuộc tính style khác ở đây nếu cần
  };

  // Add the keyframes for blink animation to the style of the component
  const boxStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      "& img": {
        transform: "scale(1.1)",
      },
      "& h6": {
        color: "secondary.main",
      },
    },
  };

  return (
    <>
      <style>{blinkAnimation}</style>
      <Box sx={boxStyle} onClick={handleLogoClick}>
        <img src={imagePath} alt="Logo" style={logoImageStyle} />
        <Typography
          variant="h5"
          color={color || "inherit"}
          noWrap
          style={typographyStyle}
        >
          TAN BOUTIQUE
        </Typography>
      </Box>
    </>
  );
};

export default Logo;
