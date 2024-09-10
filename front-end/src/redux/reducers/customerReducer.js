import {
  FETCH_CUSTOMERS_FAILURE,
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_SUCCESS,
} from "../actions/actionTypes";

const initialState = {
  customers: [],
  loading: false,
  error: null,
  notification: null,
};

export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CUSTOMERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_CUSTOMERS_SUCCESS:
      return { ...state, loading: false, customers: action.payload };
    case FETCH_CUSTOMERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Xử lý các trạng thái khác cho CRUD
    case "UPDATE_CUSTOMER_SUCCESS":
    case "CREATE_CUSTOMER_SUCCESS":
      return {
        ...state,
        notification: action.payload.message,
      };
    case "CUSTOMER_CREATE_OR_UPDATE_FAIL":
      return {
        ...state,
        notification: action.error,
      };
    case "CLEAR_CUSTOMER_NOTIFICATION":
      return {
        ...state,
        notification: null,
      };
    default:
      return state;
  }
};
