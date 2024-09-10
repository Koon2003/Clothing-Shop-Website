import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MenuItems = ({ textColor }) => {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch the categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/categories");
        setCategories(response.data.data); // Cập nhật trạng thái categories với dữ liệu nhận được
      } catch (error) {
        console.error('There was an error fetching the categories', error);
      }
    };
    fetchCategories();
  }, []);

  // Handle the click event on a category
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`); // Điều hướng đến trang danh mục sản phẩm
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        {categories.map((category) => (
          <ListItem
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
          >
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", sm: "flex" },
          justifyContent: "flex-end",
        }}
      >
        {categories.map((category) => (
          <Button
            key={category._id}
            sx={{
              my: 2,
              color: textColor,
              display: "block",
              fontFamily: "SFUFuturaBookOblique",
              fontSize: "1.2rem",
              fontWeight: "bold",
              "&::before": {
                content: '""',
                position: "absolute",
                width: "0",
                height: "2px",
                bottom: "0",
                left: "0",
                backgroundColor: textColor,
                visibility: "hidden",
                transition: "all 0.3s ease-in-out",
              },
              "&:hover::before": {
                visibility: "visible",
                width: "100%",
              },
            }}
            onClick={() => handleCategoryClick(category._id)}
          >
            {category.name}
          </Button>
        ))}
      </Box>

      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { md: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default MenuItems;
