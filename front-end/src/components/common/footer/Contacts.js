import React from "react";
import { IconButton, Box, Typography, Link } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const Contacts = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Stack children vertically
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        fontFamily: "SFUFuturaBookOblique", // Apply the custom font
      }}
    >
      {/* Contact Information */}
      <Box
        sx={{
          textAlign: "center",
          mb: 2, // Add margin below contact information
        }}
      >
        {/* Phone */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1, // Increase line spacing
          }}
        >
          <PhoneIcon />
          <Typography
            variant="body1"
            sx={{
              ml: 1,
              lineHeight: "1.75", // Increase line height for better spacing
              fontSize: "1.3rem",
            }}
          >
            Hotline: 1900.272737 - 028.7777.2737 (8:30 - 22:00)
          </Typography>
        </Box>
        {/* Email */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1, // Increase line spacing
          }}
        >
          <EmailIcon />
          <Typography
            variant="body1"
            sx={{
              ml: 1,
              lineHeight: "1.75", // Increase line height for better spacing
              fontSize: "1.3rem",
            }}
          >
            Email: Cool@coolmate.me
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            lineHeight: "1.75", // Increase line height for better spacing
            fontSize: "1.3rem",
          }}
        >
          Địa chỉ liên hệ: Tầng 2-3, Toà nhà A, Đường Phùng Hưng, Phường Phúc
          La, Quận Hà Đông, TP Hà Nội
        </Typography>
      </Box>
      {/* Social Media Icons */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          aria-label="facebook"
          component="a"
          href="https://www.facebook.com/thanh.vuduythanh.9440"
          size="large"
        >
          <FacebookIcon style={{ fontSize: "4rem" }} />
        </IconButton>
        <IconButton
          aria-label="instagram"
          component="a"
          href="https://www.instagram.com/_kon_2003_/?hl=en"
          size="large"
        >
          <InstagramIcon style={{ fontSize: "4rem" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Contacts;
