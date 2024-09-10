import { ADD_TO_CART, CLEAR_CART } from "../actions/actionTypes";

const initialState = {
    cart: (() => {
        const storedCart = localStorage.getItem('cart');
        try {
            return JSON.parse(storedCart) || [];
        } catch (error) {
            // Trả về mảng rỗng nếu có lỗi khi parse hoặc giá trị trong localStorage không hợp lệ
            return [];
        }
    })(),
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                ...state,
                cart: [...state.cart, action.payload],
            };
        case CLEAR_CART:
            return {
                ...state,
                cart: [], // Đặt giỏ hàng về trạng thái rỗng
            };
        default:
            return state;
    }
};

export default cartReducer;
