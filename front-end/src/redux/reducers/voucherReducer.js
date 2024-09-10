import {
  CHECK_VOUCHER_REQUEST,
  VOUCHER_CHECK_FAIL,
  VOUCHER_CHECK_SUCCESS,
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
} from "../actions/actionTypes";

const initialState = {
  loading: false,
  data: null,
  vouchers: [],
  error: null,
  success: false,
};

const voucherReducer = (state = initialState, action) => {
  switch (action.type) {
    case VOUCHER_CHECK_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        success: true,
      };
    case VOUCHER_CHECK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case FETCH_VOUCHERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_VOUCHERS_SUCCESS:
      return {
        ...state,
        loading: false,
        vouchers: action.payload,
        error: null,
      };
    case FETCH_VOUCHERS_FAIL:
      return {
        ...state,
        loading: false,
        vouchers: [],
        error: action.payload,
      };

    case ADD_VOUCHER_REQUEST:
    case UPDATE_VOUCHER_REQUEST:
    case DELETE_VOUCHER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_VOUCHER_SUCCESS:
    case UPDATE_VOUCHER_SUCCESS:
    case DELETE_VOUCHER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case ADD_VOUCHER_FAIL:
    case UPDATE_VOUCHER_FAIL:
    case DELETE_VOUCHER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default voucherReducer;