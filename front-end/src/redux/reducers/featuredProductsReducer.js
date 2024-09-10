import { FETCH_FEATURED_PRODUCTS_REQUEST, FETCH_FEATURED_PRODUCTS_SUCCESS, FETCH_FEATURED_PRODUCTS_FAILURE } from '../actions/actionTypes';

const initialState = {
    items: [],
    loading: false,
    error: null,
  };
  

export const featuredProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_FEATURED_PRODUCTS_REQUEST:
            return { ...state, loading: true };
        case FETCH_FEATURED_PRODUCTS_SUCCESS:
            return { ...state, loading: false, items: action.payload };
        case FETCH_FEATURED_PRODUCTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};