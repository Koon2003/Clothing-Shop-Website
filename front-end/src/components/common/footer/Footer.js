import React from "react";
import { Box, Typography, Link, Divider } from "@mui/material";
import Contacts from "./Contacts";

const Footer = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 8,
        }}
      >
        <Contacts />
        <Box sx={{ display: "flex", gap: 2, my: 2 }}>
          {" "}
          {/* Increased margin around policy links if needed */}
          <Link href="/chinh-sach-giao-hang" color="inherit" underline="hover">
            Chính Sách Giao Hàng
          </Link>
          <Link href="/chinh-sach-bao-mat" color="inherit" underline="hover">
            Chính Sách Bảo Mật
          </Link>
          <Link href="/dieu-khoan-dich-vu" color="inherit" underline="hover">
            Điều Khoản Dịch Vụ
          </Link>
          <Link href="/copyrights" color="inherit" underline="hover">
            Đăng Ký Bản Quyền
          </Link>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Created by Thanh
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;