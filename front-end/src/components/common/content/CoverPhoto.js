import React from "react";

const CoverPhoto = ({ imageUrl }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "120vh", // Full viewport height
        width: "auto", // Full viewport width
        position: "relative", // For the header to be absolutely positioned over this
        zIndex: 2, // Ensure the image is behind the header
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100%",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))", // Màu xanh nước biển với độ trong suốt
          zIndex: 3, // Đảm bảo div này nằm giữa CoverPhoto và Header
        }}
      />
    </div>
  );
}

export default CoverPhoto;