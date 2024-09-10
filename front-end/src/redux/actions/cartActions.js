import { ADD_TO_CART, CLEAR_CART } from "./actionTypes";

export const addToCart = (item) => {
    return (dispatch, getState) => {
        dispatch({
            type: ADD_TO_CART,
            payload: item,
        });
    };
};

// Action Creator for clearing the cart
export const clearCart = () => {
    return {
        type: CLEAR_CART,
    };
};