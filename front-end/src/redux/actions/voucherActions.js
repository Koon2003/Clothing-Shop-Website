import axios from "axios";
import {
  VOUCHER_CHECK_SUCCESS,
  VOUCHER_CHECK_FAIL,
  FETCH_VOUCHERS_REQUEST,
  FETCH_VOUCHERS_SUCCESS,
  FETCH_VOUCHERS_FAIL,
  ADD_VOUCHER_REQUEST,
  ADD_VOUCHER_SUCCESS,
  ADD_VOUCHER_FAIL,
  UPDATE_VOUCHER_REQUEST,
  UPDATE_VOUCHER_SUCCESS,
  UPDATE_VOUCHER_FAIL,
  DELETE_VOUCHER_REQUEST,
  DELETE_VOUCHER_SUCCESS,
  DELETE_VOUCHER_FAIL,
} from "./actionTypes";

const API_URL = "http://localhost:8000/vouchers";

// Hàm lấy token từ local storage hoặc một nguồn lưu trữ khác
const getToken = () => {
  return sessionStorage.getItem("token");
};

export const fetchVouchers = () => async (dispatch) => {
  dispatch({ type: FETCH_VOUCHERS_REQUEST });
  try {
    const response = await axios.get(API_URL);
    dispatch({ type: FETCH_VOUCHERS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_VOUCHERS_FAIL, payload: error.message });
  }
};

// Add Voucher
export const addVoucher = (voucherData) => async (dispatch) => {
  const token = getToken();

  if (!token) {
    dispatch({ type: ADD_VOUCHER_FAIL, payload: "No token found" });
    return;
  }

  dispatch({ type: ADD_VOUCHER_REQUEST });
  try {
    // Thêm Authorization header với token
    const response = await axios.post(API_URL, voucherData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: ADD_VOUCHER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: ADD_VOUCHER_FAIL, payload: error.message });
  }
};

// Update Voucher
export const updateVoucher = (voucherId, voucherData) => async (dispatch) => {
  const token = getToken();

  if (!token) {
    dispatch({ type: UPDATE_VOUCHER_FAIL, payload: "No token found" });
    return;
  }

  dispatch({ type: UPDATE_VOUCHER_REQUEST });

  try {
    // Add Authorization header with token
    const response = await axios.put(`${API_URL}/${voucherId}`, voucherData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: UPDATE_VOUCHER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_VOUCHER_FAIL, payload: error.message });
  }
};

// Delete Voucher
export const deleteVoucher = (voucherId) => async (dispatch) => {
  const token = getToken();

  if (!token) {
    dispatch({ type: DELETE_VOUCHER_FAIL, payload: "No token found" });
    return;
  }

  dispatch({ type: DELETE_VOUCHER_REQUEST });
  try {
    // Add Authorization header with token
    const response = await axios.delete(`${API_URL}/${voucherId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: DELETE_VOUCHER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: DELETE_VOUCHER_FAIL, payload: error.message });
  }
};

// Check Voucher
export const checkVoucher = (code) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/vouchers/code/${code}`
    );
    // Xử lý kết quả
    dispatch({
      type: VOUCHER_CHECK_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    // Xử lý lỗi
    dispatch({
      type: VOUCHER_CHECK_FAIL,
      payload: error.response,
    });
  }
};
