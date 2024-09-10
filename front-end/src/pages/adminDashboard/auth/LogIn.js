import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { loginUser } from "../../../redux/actions/userActions";

const LogIn = ({ updateAdminDashboardState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    // Gọi API đăng nhập
    fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Không tìm thấy User");
          }
          if (response.status === 401) {
            throw new Error("Mật khẩu không đúng");
          }
          throw new Error("Đăng nhập thất bại!");
        }
        return response.json();
      })
      .then((data) => {
        // Kiểm tra xem user có role admin không
        const isAdmin = Array.isArray(data.userRole) && data.userRole.includes("Admin");

        if (!isAdmin) {
          throw new Error("Chỉ Admin mới có quyền truy cập.");
        }

        // Tiếp tục xử lý nếu là admin
        // Lưu token và refreshToken vào sessionStorage
        sessionStorage.setItem("token", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);

        // Lưu thông tin khách hàng vào sessionStorage (nếu có)
        if (data.customerInfo) {
          sessionStorage.setItem(
            "customerInfo",
            JSON.stringify(data.customerInfo)
          );
        }

        sessionStorage.setItem("userEmail", data.email);

        // Đặt trạng thái đăng nhập trong sessionStorage
        sessionStorage.setItem("isLoggedIn", true);
        // Dispatch hành động đăng nhập tới Redux store
        dispatch(
          loginUser({
            token: data.accessToken,
            refreshToken: data.refreshToken,
            userRole: data.userRole,
            email: data.email,
            customerInfo: data.customerInfo,
          })
        );

        // Chuyển hướng người dùng sau khi đăng nhập thành công
        setOpenSnackbar(true);

        // Cập nhật trạng thái và chuyển đổi nội dung
        // Giả sử chúng ta có hàm updateAdminDashboardState được truyền từ AdminDashboard
        updateAdminDashboardState({
          isLoggedIn: true,
          userEmail: data.email,
        });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "400px", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Đăng Nhập
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email đăng nhập"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Mật khẩu"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Đăng Nhập
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Đăng nhập thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LogIn;
