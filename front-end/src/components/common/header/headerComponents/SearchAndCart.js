import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Box,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CartModal from "../../utilities/modal/CartModal";
import { useNavigate } from "react-router-dom";

const SearchAndCart = ({ color }) => {
  // State để lưu số lượng sản phẩm trong giỏ hàng
  const [cartQuantity, setCartQuantity] = useState(0);
  // State để mở và đóng modal
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  // State để lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  // Hook để điều hướng đến trang tìm kiếm
  const navigate = useNavigate();

  // Function to calculate the total quantity of cart items
  const updateCartQuantity = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    setCartQuantity(totalQuantity);
  };

  // Update the cart quantity when the component mounts
  useEffect(() => {
    updateCartQuantity(); // Calculate the initial cart quantity

    // Set up an event listener for cart updates
    const handleCartUpdate = () => updateCartQuantity();
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Clean up the event listener
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // Function to handle the cart icon click
  const handleCartClick = () => {
    setCartModalOpen(true);
  };

  // Function to handle the search icon click
  const handleSearchClick = () => {
    setSearchModalOpen(true);
  };

  // Function to handle the search
  const handleSearch = () => {
    navigate(`/search?query=${searchTerm}`);
  };

  // Style cho icon giỏ hàng
  const shoppingCartIconStyle = {
    color: cartQuantity > 0 ? color : color, // Set color based on the prop
    backgroundColor: cartQuantity > 0 ? "red" : "transparent",
    borderRadius: "50%",
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <IconButton onClick={handleSearchClick}>
          <SearchIcon sx={{ fontSize: 30, color: color }} />
        </IconButton>
        <IconButton onClick={handleCartClick}>
          <Badge badgeContent={cartQuantity} color="secondary">
            <ShoppingCartIcon sx={{ fontSize: 30, ...shoppingCartIconStyle }} />
          </Badge>
        </IconButton>
      </Box>
      {/* Search Modal */}
      <Modal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        aria-labelledby="search-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw', // Full width
          height: '100vh', // Full height
          overflow: 'auto', // Allow scrolling if necessary
        }}
      >
        <Box
          sx={{
            position: 'fixed', // Fixed position to stay in view
            top: 0, // Align to the top
            left: 0, // Align to the left
            width: '100%', // Full width
            height: '100%', // Full height
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column', // Stack items vertically
            justifyContent: 'center', // Center vertically
            alignItems: 'center', // Center horizontally
            p: 4, // Padding
            zIndex: 1300,
          }}
        >
          {/* Nút đóng ở góc trên cùng bên phải */}
          <IconButton
            onClick={() => setSearchModalOpen(false)}
            sx={{
              position: 'absolute',
              top: 15, // Đặt cách đỉnh một khoảng nhỏ
              right: 15, // Đặt cách bên phải một khoảng nhỏ
              color: 'black', // Đặt màu cho biểu tượng
              zIndex: 1400, // Đảm bảo rằng nút này nằm trên cùng của stack context
            }}
          >
            <CloseIcon />
          </IconButton>

          <TextField
            label="Tìm kiếm sản phẩm..."
            variant="outlined"
            fullWidth
            autoFocus // Automatically focus the input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
            sx={{
              mb: 2, // Margin bottom for spacing
              width: '80%', // Use less than full width for aesthetics
            }}
          />
          <Button
            onClick={handleSearch}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              fontFamily: 'SFUFuturaBookOblique',
              px: 5, // Padding left and right
              py: 1, // Padding top and bottom
              '&:hover': {
                backgroundColor: 'grey', // Change color on hover
              }
            }}
          >
            Tìm Kiếm
          </Button>
        </Box>
      </Modal>

      {/* Modal hiển thị thông tin giỏ hàng */}
      <Modal
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        aria-labelledby="cart-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>
          {/* Nội dung modal, bạn có thể truyền props nếu cần */}
          <CartModal onClose={() => setCartModalOpen(false)} />
        </Box>
      </Modal>
    </>
  );
};

export default SearchAndCart;
