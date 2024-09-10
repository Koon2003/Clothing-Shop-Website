import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Modal,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import {
  updateVoucher,
  fetchVouchers,
} from "../../../../../redux/actions/voucherActions";

const EditVoucherModal = ({
  open,
  handleClose,
  voucher,
  openGlobalSnackbar,
}) => {
  // Get dispatch function from redux store
  const dispatch = useDispatch();
  // Local state
  const [voucherData, setVoucherData] = useState({
    code: "",
    discount: "",
    expiresAt: "",
  });

  // Set initial voucher data
  useEffect(() => {
    if (voucher) {
      const formattedDate = new Date(voucher.expiresAt)
        .toISOString()
        .split("T")[0];
      setVoucherData({
        code: voucher.code,
        discount: voucher.discount,
        expiresAt: formattedDate, // Sử dụng formattedDate
      });
    }
  }, [voucher]);

  // Hàm xử lý khi thay đổi input
  const handleChange = (e) => {
    setVoucherData({ ...voucherData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateVoucher(voucher._id, voucherData))
      .then(() => {
        openGlobalSnackbar("Voucher đã được cập nhật thành công.", "success");
        handleClose();
        dispatch(fetchVouchers());
      })
      .catch((error) => {
        openGlobalSnackbar(
          `Xảy ra lỗi khi cập nhật voucher: ${error.message}`,
          "error"
        );
      });
  };

  // Style cho các component
  const headerStyle = {
    fontFamily: "SFUFuturaBookOblique",
    fontWeight: "bold",
    fontSize: "1.4rem",
  };
  const buttonStyle = {
    backgroundColor: "black",
    fontFamily: "SFUFuturaBookOblique",
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper style={{ padding: 20, margin: "auto", maxWidth: 500 }}>
        <Typography variant="h6" sx={headerStyle}>
          Sửa Voucher
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Code"
            name="code"
            value={voucherData.code}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Discount"
            name="discount"
            type="number"
            value={voucherData.discount}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Ngày Hết Hạn"
            name="expiresAt"
            type="date"
            value={voucherData.expiresAt}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            color="primary"
            fullWidth
            sx={{ ...buttonStyle, mt: 2 }}
            variant="contained"
          >
            Xác Nhận
          </Button>
          <Button
            onClick={handleClose}
            fullWidth
            sx={{ mt: 1 }}
            variant="outlined"
          >
            Hủy
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default EditVoucherModal;
