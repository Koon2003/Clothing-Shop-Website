import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchCustomers, updateCustomer } from '../../../../../redux/actions/customerActions';
import Autocomplete from '@mui/material/Autocomplete';
import provincesData from '../../../../../pages/path/to/data.json';

// Helper functions for validation
const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
const validatePhone = (phone) => /^(\+84|0)[3|5|7|8|9][0-9]{8}$/.test(phone);

const EditCustomerModal = ({ open, handleClose, customer, openGlobalSnackbar }) => {
    const dispatch = useDispatch();

    console.log(customer);
    // Local state
    const [customerData, setCustomerData] = useState({ ...customer });
    const [errors, setErrors] = useState({});

    // Local state for selected city, district, ward
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    // Set initial customer data
    useEffect(() => {
        setCustomerData({ ...customer });
        // Find and set the initial province, district, and ward objects from provincesData
        const initialProvince = provincesData.find(province => province.name === customer.city);
        const initialDistrict = initialProvince?.districts.find(district => district.name === customer.district);
        const initialWard = initialDistrict?.wards.find(ward => ward.name === customer.ward);

        // Set initial city, district, ward if available
        setSelectedProvince(initialProvince || null);
        setSelectedDistrict(initialDistrict || null);
        setSelectedWard(initialWard || null);
    }, [customer]);

    // Hàm xử lý khi thay đổi input
    const handleChange = (e) => {
        setCustomerData({ ...customerData, [e.target.name]: e.target.value });
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

    // Handle submit
    const handleSubmit = () => {
        if (!validateForm()) return;

        dispatch(updateCustomer(customerData._id, customerData))
            .then(() => {
                // If update is successful
                openGlobalSnackbar('Cập nhật khách hàng thành công', 'success');
                handleClose();
                dispatch(fetchCustomers()); // Refresh customer list
            })
            .catch((error) => {
                // If there is an error
                openGlobalSnackbar(`Error updating customer: ${error.message}`, 'error');
            });
    };

    // Style cho các component
    const headerStyle = { fontFamily: 'SFUFuturaBookOblique', fontWeight: 'bold', fontSize: '1.4rem' };
    const buttonStyle = { backgroundColor: 'black', fontFamily: 'SFUFuturaBookOblique' };


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={headerStyle} align='center'>Sửa Khách Hàng</DialogTitle>
            <DialogContent>
                <TextField
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    label="Họ & Tên"
                    name="fullName"
                    value={customerData.fullName}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    error={!!errors.email}
                    helperText={errors.email}
                    label="Email"
                    name="email"
                    value={customerData.email}
                    onChange={handleChange}
                    fullWidth margin="dense"
                />
                <TextField
                    error={!!errors.phone}
                    helperText={errors.phone}
                    label="Số Điện Thoại"
                    name="phone"
                    value={customerData.phone}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField label="Địa Chỉ" name="address" value={customerData.address} onChange={handleChange} fullWidth margin="dense" />
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
                    isOptionEqualToValue={(option, value) => option.name === value.name}
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
                <Button sx={buttonStyle} onClick={handleSubmit} variant="contained">LƯU</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCustomerModal;
