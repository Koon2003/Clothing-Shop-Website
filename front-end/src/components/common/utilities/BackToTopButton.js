import React from "react";
import { Fab, useScrollTrigger, Zoom, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const BackToTopButton = () => {
  // Hàm xử lý khi người dùng cuộn chuột
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100, // The button will become visible after scrolling down 100px
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
      <div
        style={{ position: "fixed", bottom: 16, left: 16, textAlign: "center" }}
      >
        <Fab
          color="secondary"
          size="large"
          onClick={handleClick}
          style={{ marginBottom: "8px" }}
        >
          <ArrowUpwardIcon />
        </Fab>
      </div>
    </Zoom>
  );
};

export default BackToTopButton;
