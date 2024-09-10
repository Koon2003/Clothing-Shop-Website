import { error } from "jquery";
import {
  ADD_PRODUCT,
  DELETE_COMMON_IMAGES_FAILURE,
  DELETE_COMMON_IMAGES_REQUEST,
  DELETE_COMMON_IMAGES_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_VARIANT_FAILURE,
  DELETE_VARIANT_IMAGES_FAILURE,
  DELETE_VARIANT_IMAGES_REQUEST,
  DELETE_VARIANT_IMAGES_SUCCESS,
  DELETE_VARIANT_REQUEST,
  DELETE_VARIANT_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
} from "../actions/actionTypes";

const initialState = {
  items: [],
  loading: false,
  deletingCommonImages: false,
  deletingVariantImages: false,
  deletingVariant: false,
  error: null,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, items: action.payload };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Search for products cases
    case SEARCH_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case SEARCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, items: action.payload };
    case SEARCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Add products cases
    case ADD_PRODUCT:
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    // Update product cases
    
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.map(item =>
          item._id === action.payload._id ? action.payload : item
        ),
        error: null,
      };
    case UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Remove common images, variant images and variants cases
    case DELETE_COMMON_IMAGES_REQUEST:
      return {
        ...state,
        deletingCommonImages: true,
        error: null,
      };
    case DELETE_COMMON_IMAGES_SUCCESS:
      return {
        ...state,
        deletingCommonImages: false,
        error: null,
      };
    case DELETE_COMMON_IMAGES_FAILURE:
      return {
        ...state,
        deletingCommonImages: false,
        error: action.error,
      };
    case DELETE_VARIANT_IMAGES_REQUEST:
      return {
        ...state,
        deletingVariantImages: true,
        error: null,
      };
    case DELETE_VARIANT_IMAGES_SUCCESS:
      return {
        ...state,
        deletingVariantImages: false,
        error: null,
      };
    case DELETE_VARIANT_IMAGES_FAILURE:
      return {
        ...state,
        deletingVariantImages: false,
        error: action.error,
      };
    case DELETE_VARIANT_REQUEST:
      return {
        ...state,
        deletingVariant: true,
        error: null,
      };
    case DELETE_VARIANT_SUCCESS:
      return {
        ...state,
        deletingVariant: false,
        error: null,
      };
    case DELETE_VARIANT_FAILURE:
      return {
        ...state,
        deletingVariant: false,
        error: action.error,
      };

    // Delete product cases
    case DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true };
    case DELETE_PRODUCT_SUCCESS:
      // Kiểm tra nếu state.items là một mảng trước khi thực hiện filter
      const updatedItems = Array.isArray(state.items)
        ? state.items.filter((product) => product._id !== action.payload)
        : [];
      return {
        ...state,
        loading: false,
        items: updatedItems,
      };
    case DELETE_PRODUCT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
