import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import Autocomplete from '@mui/material/Autocomplete';
import { createCustomer, fetchCustomers } from "../../../../../redux/actions/customerActions";
import provincesData from "../../../../../pages/path/to/data.json";

// Helper functions for validation
const validateEmail = (email) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
};

const validatePhone = (phone) => {
    const regex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
    return regex.test(phone);
};

const AddCustomerModal = ({ open, handleClose, openGlobalSnackbar }) => {
    const dispatch = useDispatch();

    // Local state
    const [customerData, setCustomerData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        country: 'Việt Nam',
    });

    // Local state for selected city, district, ward
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    // Local state for errors
    const [errors, setErrors] = useState({});


    // Hàm xử lý khi thay đổi input
    const handleChange = (e) => {
        setCustomerData({ ...customerData, [e.target.name]: e.target.value });
        // Clear error for this field
        setErrors({ ...errors, [e.target.name]: '' });
    };

    // Hàm kiểm tra form hợp lệ
    const validateForm = () => {
        let newErrors = {};
        if (!customerData.fullName) newErrors.fullName = 'Họ và tên là bắt buộc';
        if (!customerData.phone) newErrors.phone = 'Số điện thoại là bắt buộc';
        else if (!validatePhone(customerData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
        if (!customerData.email) newErrors.email = 'Email là bắt buộc';
        else if (!validateEmail(customerData.email)) newErrors.email = 'Email không hợp lệ';
        // Add other field validations as needed
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        dispatch(createCustomer(customerData))
            .then((message) => {
                openGlobalSnackbar(message, 'success');
                dispatch(fetchCustomers()); // Update customer list
                handleClose(); // Close modal on success
            })
            .catch((error) => {
                openGlobalSnackbar('Lỗi khi thêm khách hàng: ' + error, 'error');
                // Optional: Keep the modal open for the user to correct the input
            });
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={headerStyle} align='center'>Thêm Khách Hàng Mới</DialogTitle>
            <DialogContent>
                <TextField 
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    name="fullName"
                    label="Họ và Tên"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                />
                <TextField
                    error={!!errors.phone}
                    helperText={errors.phone}
                    name="phone"
                    label="Số Điện Thoại"
                    fullWidth margin="dense"
                    onChange={handleChange}
                />
                <TextField
                    error={!!errors.email}
                    helperText={errors.email}
                    name="email"
                    label="Email"
                    fullWidth
                    margin="dense"
                    onChange={handleChange}
                />
                <TextField 
                    name="address" 
                    label="Địa Chỉ" 
                    fullWidth margin="dense" 
                    onChange={handleChange} 
                />
                {/* Select for City, District, and Ward */}
                <Autocomplete 
                    value={selectedProvince}
                    onChange={(event, newValue) => {
                        setSelectedProvince(newValue);
                        setSelectedDistrict(null);
                        setSelectedWard(null);
                        setCustomerData({ ...customerData, city: newValue?.name || '', district: '', ward: '' });
                    }}
                    options={provincesData}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => <TextField {...params} label="Tỉnh/Thành phố" margin="normal" />}
                />

                <Autocomplete
                    value={selectedDistrict}
                    onChange={(event, newValue) => {
                        setSelectedDistrict(newValue);
                        setSelectedWard(null);
                        setCustomerData({ ...customerData, district: newValue?.name || '', ward: '' });
                    }}
                    options={selectedProvince?.districts || []}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => <TextField {...params} label="Quận/Huyện" margin="normal" />}
                    disabled={!selectedProvince}
                />

                <Autocomplete
                    value={selectedWard}
                    onChange={(event, newValue) => {
                        setSelectedWard(newValue);
                        setCustomerData({ ...customerData, ward: newValue?.name || '' });
                    }}
                    options={selectedDistrict?.wards || []}
                    getOptionLabel={(option) => option.name || ''}
                    renderInput={(params) => <TextField {...params} label="Phường/Xã" margin="normal" />}
                    disabled={!selectedDistrict}
                />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} variant="outlined">Hủy</Button>
                <Button sx={buttonStyle} onClick={handleSubmit} variant="contained">THÊM</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCustomerModal;