import {
  DELETE_CUSTOMER_FAIL,
  DELETE_CUSTOMER_SUCCESS,
  FETCH_CUSTOMERS_FAILURE,
  FETCH_CUSTOMERS_REQUEST,
  FETCH_CUSTOMERS_SUCCESS,
  UPDATE_CUSTOMER_FAILURE,
  UPDATE_CUSTOMER_REQUEST,
  UPDATE_CUSTOMER_SUCCESS,
} from "./actionTypes";

// Hàm lấy token từ local storage hoặc một nguồn lưu trữ khác
const getToken = () => {
  return sessionStorage.getItem("token");
};

// Fetch Customers
export const fetchCustomers = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CUSTOMERS_REQUEST });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/customers`
      );
      const data = await response.json();
      dispatch({ type: FETCH_CUSTOMERS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_CUSTOMERS_FAILURE, payload: error });
    }
  };
};

export const updateCustomer = (customerId, data) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CUSTOMER_REQUEST });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/customers/${customerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const updatedCustomer = await response.json();
      dispatch({ type: UPDATE_CUSTOMER_SUCCESS, payload: updatedCustomer });
    } catch (error) {
      dispatch({ type: UPDATE_CUSTOMER_FAILURE, payload: error });
    }
  };
};

export const createCustomer = (customerData) => {
  return async (dispatch) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if email exists
        let response = await fetch(
          `${process.env.REACT_APP_API_URL}/customers/email/${customerData.email}`
        );
        let existingCustomer = null;
        let message = "";

        if (response.ok) {
          existingCustomer = await response.json();
        }

        if (existingCustomer) {
          // Update existing customer
          response = await fetch(
            `${process.env.REACT_APP_API_URL}/customers/${existingCustomer._id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(customerData),
            }
          );

          if (!response.ok) {
            throw new Error("Không thể cập nhật khách hàng");
          }

          message = "Khách hàng cập nhật thành công.";
        } else {
          // Create new user if email not exists
          await fetch(
            `${process.env.REACT_APP_API_URL}/user/create-from-email`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: customerData.email }),
            }
          );

          // Create new customer
          response = await fetch(`${process.env.REACT_APP_API_URL}/customers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
          });

          if (!response.ok) {
            throw new Error("Không thể tạo khách hàng mới");
          }

          message = "Khách hàng và user mới tạo thành công.";
        }

        // Dispatch success action with the appropriate message
        dispatch({
          type: existingCustomer
            ? "UPDATE_CUSTOMER_SUCCESS"
            : "CREATE_CUSTOMER_SUCCESS",
          payload: { message },
        });

        resolve(message); // Resolve promise with success message
      } catch (error) {
        console.error("Lỗi:", error);
        dispatch({
          type: "CUSTOMER_CREATE_OR_UPDATE_FAIL",
          error: error.message,
        });
        reject(error.message); // Reject promise with error message
      }
    });
  };
};

export const deleteCustomer = (customerId) => {
  return async (dispatch) => {
    const token = getToken();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/customers/${customerId}?forceDelete=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Error deleting customer");

      dispatch({ type: DELETE_CUSTOMER_SUCCESS, payload: customerId });
      return response.json(); // Trả về phản hồi từ server
    } catch (error) {
      console.error("Error:", error);
      dispatch({ type: DELETE_CUSTOMER_FAIL, error: error.message });
      throw error; // Ném lỗi để bắt ở component
    }
  };
};
