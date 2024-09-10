import {
  ADD_CATEGORY_FAILURE,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
} from "./actionTypes";

//require("dotenv").config();

// Fetch categories
export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORIES_REQUEST });
  try {
    const response = await fetch("http://localhost:8000/categories");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const categories = await response.json();
    dispatch({ type: FETCH_CATEGORIES_SUCCESS, categories });
  } catch (error) {
    dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error.message });
  }
};

// Add category
export const addCategory = (categoryData) => async (dispatch) => {
  dispatch({ type: ADD_CATEGORY_REQUEST });
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    const newCategory = await response.json();
    dispatch({ type: ADD_CATEGORY_SUCCESS, payload: newCategory });
  } catch (error) {
    dispatch({ type: ADD_CATEGORY_FAILURE, payload: error.message });
  }
};

// Update category
export const updateCategory = (categoryId, updatedData) => async (dispatch) => {
  dispatch({ type: UPDATE_CATEGORY_REQUEST });
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
    const updatedCategory = await response.json();
    dispatch({ type: UPDATE_CATEGORY_SUCCESS, payload: updatedCategory });
  } catch (error) {
    dispatch({ type: UPDATE_CATEGORY_FAILURE, payload: error.message });
  }
};

// Delete category
export const deleteCategory = (categoryId) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/categories/${categoryId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: categoryId });
  } catch (error) {
    dispatch({ type: DELETE_CATEGORY_FAILURE, payload: error.message });
  }
};
