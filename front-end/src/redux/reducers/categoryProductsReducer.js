import { FETCH_CATEGORY_PRODUCTS_BEGIN, FETCH_CATEGORY_PRODUCTS_SUCCESS, FETCH_CATEGORY_PRODUCTS_FAILURE } from '../actions/actionTypes';


const initialState = {
    products: [],
    loading: false,
    error: null,
    categoryName: ''
};

const categoryProductsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CATEGORY_PRODUCTS_BEGIN:
            return { ...state, loading: true, error: null, products: [] }; // Reset products array
        case FETCH_CATEGORY_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload.products,
                categoryName: action.payload.categoryName // Assuming the categoryName is included in payload
            };
        case FETCH_CATEGORY_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload ? action.payload.error : 'Unknown error',
                products: []
            };
        default:
            return state;
    }
};


export default categoryProductsReducer;
