import {
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  DELETE_ORDER_FAILURE,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  FETCH_ORDERS_FAILURE,
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  UPDATE_ORDER_FAILURE,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
} from "./actionTypes";

// Fetch Orders Actions
const fetchOrdersRequest = () => ({
  type: FETCH_ORDERS_REQUEST,
});

const fetchOrdersSuccess = (orders) => ({
  type: FETCH_ORDERS_SUCCESS,
  payload: orders,
});

const fetchOrdersFailure = (error) => ({
  type: FETCH_ORDERS_FAILURE,
  payload: error,
});

export const fetchOrders = (page, limit) => {
  return async (dispatch) => {
    dispatch(fetchOrdersRequest());
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      dispatch(fetchOrdersSuccess(data));
    } catch (error) {
      dispatch(fetchOrdersFailure(error.message));
    }
  };
};

// Update Order Actions
const updateOrderRequest = () => ({
  type: UPDATE_ORDER_REQUEST,
});

const updateOrderSuccess = (order) => ({
  type: UPDATE_ORDER_SUCCESS,
  payload: order,
});

const updateOrderFailure = (error) => ({
  type: UPDATE_ORDER_FAILURE,
  payload: error,
});

export const updateOrder = (orderId, orderData) => {
  return async (dispatch) => {
    dispatch(updateOrderRequest());
    try {
      // Lấy token từ sessionStorage hoặc nơi khác nơi bạn lưu token
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      const data = await response.json();
      dispatch(updateOrderSuccess(data));
    } catch (error) {
      dispatch(updateOrderFailure(error.message));
    }
  };
};

// Helper function to validate email format
const validateEmail = (email) => {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

// Helper function to validate Vietnamese phone number format
const validatePhone = (phone) => {
  return /^(0?)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/.test(phone);
};

// Helper function to validate order data
const validateOrderData = (orderData) => {
  const { fullName, phone, email, address, city, district, ward, country } =
    orderData.customer;

  // Check for the presence of required customer information
  if (
    !fullName ||
    !phone ||
    !email ||
    !address ||
    !city ||
    !district ||
    !ward ||
    !country
  ) {
    console.error("Missing required customer information");
    return false;
  }

  // Validate email and phone number formats
  if (!validateEmail(email)) {
    console.error("Invalid email format");
    return false;
  }
  if (!validatePhone(phone)) {
    console.error("Invalid Vietnamese phone number format");
    return false;
  }

  // Validate product information
  if (!orderData.products || orderData.products.length === 0) {
    console.error("No products in the order");
    return false;
  }
  for (const product of orderData.products) {
    if (
      !product.product ||
      !product.quantity ||
      product.quantity <= 0 ||
      !product.size ||
      !product.color
    ) {
      console.error("Invalid product information");
      return false;
    }
  }

  return true;
};

// Helper function to check product availability
const checkProductAvailability = async (products) => {
  try {
    let isAvailable = true;

    for (let item of products) {
      const productId = item.product;

      if (!productId) {
        throw new Error(
          `Product ID not found for item: ${JSON.stringify(item)}`
        );
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${productId}`
      );
      const productData = await response.json();

      if (!response.ok || !productData) {
        throw new Error(`Không tìm được sản phẩm: ${productId}`);
      }

      const variant = productData.variants.find((v) => v.color === item.color);
      const size = variant && variant.sizes.find((s) => s.size === item.size);

      if (!size || size.amount < item.quantity) {
        isAvailable = false;
        break;
      }
    }
    return isAvailable;
  } catch (error) {
    console.error("Error in checkProductAvailability:", error);
    return false;
  }
};

// Action Creator for creating an order
export const createOrder = (orderData) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });

    try {
      if (!validateOrderData(orderData)) {
        throw new Error("Cần nhập đầy đủ thông tin!");
      }

      // Modify orderData to include only product IDs
      const modifiedOrderData = {
        ...orderData,
        cost: orderData.totalCost, // Use totalCost as the cost of the order
        products: orderData.products.map((p) => ({
          product: p.product._id, // use only the product ID
          color: p.color,
          size: p.size,
          quantity: p.quantity,
          cost: p.cost,
          promotionPrice: p.product.promotionPrice, // include promotionPrice
        })),
      };

      if (!(await checkProductAvailability(modifiedOrderData.products))) {
        throw new Error("Không đủ hàng cho 1 hoặc nhiều sản phẩm!");
      }

      const userResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/user/create-from-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: modifiedOrderData.customer.email }),
        }
      );

      if (!userResponse.ok) {
        throw new Error(
          `Failed to create/find user: ${await userResponse.text()}`
        );
      }
      const user = await userResponse.json();

      // Updating or creating customer and getting the customer ID
      const customerResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/customers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...orderData.customer, userId: user._id }),
        }
      );

      if (!customerResponse.ok) {
        throw new Error(
          `Failed to update/create customer: ${await customerResponse.text()}`
        );
      }
      const customerData = await customerResponse.json();
      const customerId = customerData._id || customerData.customerId; // Sửa ở đây
      // Creating new order with customer ID
      const orderResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...modifiedOrderData, customer: customerId }), // Sử dụng customerId ở đây
        }
      );

      if (!orderResponse.ok) {
        throw new Error(
          `Failed to create order: ${await orderResponse.text()}`
        );
      }
      const newOrder = await orderResponse.json();

      dispatch({ type: CREATE_ORDER_SUCCESS, payload: newOrder });
    } catch (error) {
      console.error("Error in createOrder action:", error);
      dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message });
    }
  };
};

// Delete Order
export const deleteOrder = (orderId) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_ORDER_REQUEST });
    try {
      // Lấy token từ sessionStorage hoặc nơi khác nơi bạn lưu token
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Đảm bảo token được gửi trong headers
          },
        }
      );

      if (response.ok) {
        dispatch({ type: DELETE_ORDER_SUCCESS, payload: orderId });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa đơn hàng");
      }
    } catch (error) {
      dispatch({ type: DELETE_ORDER_FAILURE, payload: error.message });
    }
  };
};
