import {
    FETCH_RELATED_PRODUCTS_REQUEST,
    FETCH_RELATED_PRODUCTS_SUCCESS,
    FETCH_RELATED_PRODUCTS_FAILURE
} from '../actions/actionTypes';

const initialState = {
    relatedItems: [],
    loading: false,
    error: null,
};

export const relatedProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_RELATED_PRODUCTS_REQUEST:
            return { ...state, loading: true };
        case FETCH_RELATED_PRODUCTS_SUCCESS:
            return { ...state, loading: false, relatedItems: action.payload };
        case FETCH_RELATED_PRODUCTS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
