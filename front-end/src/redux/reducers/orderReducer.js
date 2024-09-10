import { DELETE_ORDER_FAILURE, DELETE_ORDER_REQUEST, DELETE_ORDER_SUCCESS, FETCH_ORDERS_FAILURE, FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS } from "../actions/actionTypes";


const initialState = {
    loading: false,
    orders: [],
    total: 0,
    error: '',
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
                total: action.payload.total,
                error: '',
            };
        case FETCH_ORDERS_FAILURE:
            return {
                loading: false,
                orders: [],
                error: action.payload,
            };
        case DELETE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.filter(order => order._id !== action.payload),
                error: '',
            };
        case DELETE_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default orderReducer;
