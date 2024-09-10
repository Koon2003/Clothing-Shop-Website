import {
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORIES_SUCCESS,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILURE,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
} from "../actions/actionTypes";

const initialState = {
  categories: [],
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, categories: action.categories, error: null };
    case FETCH_CATEGORIES_FAILURE:
      return { ...state, categories: [], error: action.error };

    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        error: null,
      };
    case ADD_CATEGORY_FAILURE:
      return { ...state, error: action.payload };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
        error: null,
      };
    case UPDATE_CATEGORY_FAILURE:
      return { ...state, error: action.payload };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.id !== action.payload
        ),
        error: null,
      };
    case DELETE_CATEGORY_FAILURE:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default categoryReducer;
