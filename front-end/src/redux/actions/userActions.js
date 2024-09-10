import { SET_USER, USER_LOGIN } from "./actionTypes";

export const setUser = (userData) => {
  return {
    type: SET_USER,
    payload: userData,
  };
};

// LogIn Actions
export const loginUser = (userData) => (dispatch) => {
  // Thực hiện các hành động đồng bộ ở đây
  dispatch({
    type: USER_LOGIN,
    payload: userData,
  });

  // Lấy userRole từ userData
  const userRole = userData.userRole;

  // Dispatch setUser để lưu trữ thông tin vai trò người dùng
  dispatch(setUser({ roles: userData }));
};
