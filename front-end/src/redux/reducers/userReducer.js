import { SET_USER, USER_LOGIN, USER_LOGOUT } from "../actions/actionTypes";

const initialState = {
  isLoggedIn: !!sessionStorage.getItem("token"), // Kiểm tra xem có token trong storage không
  token: sessionStorage.getItem("token") || null, //Lấy token từ sessionStorage
  userDetails: {},
  userRole: JSON.parse(sessionStorage.getItem("userRole")) || null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOGIN:
      sessionStorage.setItem("token", action.payload.token); // Lưu token vào sessionStorage
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        userDetails: action.payload.customerInfo, // Đảm bảo rằng bạn lưu thông tin người dùng chính xác
        userRole: action.payload.userRole,
      };
    case USER_LOGOUT:
      sessionStorage.removeItem("token");
      return {
        ...state,
        isLoggedIn: false,
        token: null,
        userDetails: {},
        userRole: null,
      };
    case SET_USER:
      return {
        ...state,
        userRole: action.payload.roles,
      };
    default:
      return state;
  }
};

export default userReducer;
