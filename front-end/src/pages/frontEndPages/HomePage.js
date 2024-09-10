import { Container, Typography } from "@mui/material";
import CoverPhoto from "../../components/common/content/CoverPhoto";
import Header from "../../components/common/header/Header";
import Footer from "../../components/common/footer/Footer";
import BackToTopButton from "../../components/common/utilities/BackToTopButton";
import FadeInSection from "../../components/common/utilities/FadeInSection";
import CollectionSlide from "../../components/common/content/CollectionSlide";
import TShirt from "../../components/product/TShirt";
import SweaterJackets from "../../components/product/SweaterJackets";
import BomberJackets from "../../components/product/BomberJackets";
import HoodieJackets from "../../components/product/HoodieJackets";
import JoggerPants from "../../components/product/JoggerPants";
import FeaturedProducts from "../../components/product/FeaturedProducts";

export default function HomePage() {
  // URL ảnh CoverPhoto
  const coverPhotoUrl =
    "https://res.cloudinary.com/dzqcoirgm/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1706084791/TAN_Boutique/Banner/z4971838411717_f476d50026845ace9134457438ce4a9e_x2sece.jpg";

  // CSS cho container văn bản chạy
  const marqueeContentStyle = {
    animation: "marquee 10s linear infinite",
    whiteSpace: "nowrap",
  };
  const marqueeText = "MIỄN PHÍ VẬN CHUYỂN CHO ĐƠN HÀNG TỪ 550.000đ! ";
  return (
    <>
      <style>
        {`
            @keyframes marquee {
              0% { transform: translateX(100%); }
              90% { transform: translateX(-100%); }
              100% { transform: translateX(-100%); }
           }
        `}
      </style>

      <Typography
        style={{
          backgroundColor: "red",
          color: "white",
          textAlign: "center",
          padding: "5px",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1200,
          overflow: "hidden", // Thêm dòng này
        }}
      >
        <div style={marqueeContentStyle}>
          {Array(10).fill(marqueeText).join(" ")}
        </div>
      </Typography>

      <CoverPhoto imageUrl={coverPhotoUrl} />

      <Header />
      <FadeInSection><FeaturedProducts /></FadeInSection>

      <Container sx={{ mx: 'auto', padding: '10px' }}>
        <FadeInSection><TShirt /></FadeInSection>
        <FadeInSection><BomberJackets /></FadeInSection>
        <FadeInSection><HoodieJackets /></FadeInSection>
        <FadeInSection><SweaterJackets /></FadeInSection>
        <FadeInSection><JoggerPants /></FadeInSection>
      </Container>

      <CollectionSlide />
      <BackToTopButton />
      <Footer />
    </>
  );
}
