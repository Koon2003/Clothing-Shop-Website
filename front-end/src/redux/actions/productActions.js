import {
  FETCH_PRODUCT_DETAILS_REQUEST,
  FETCH_PRODUCT_DETAILS_SUCCESS,
  FETCH_PRODUCT_DETAILS_FAILURE,
  FETCH_RELATED_PRODUCTS_REQUEST,
  FETCH_RELATED_PRODUCTS_SUCCESS,
  FETCH_RELATED_PRODUCTS_FAILURE,
  FETCH_FEATURED_PRODUCTS_REQUEST,
  FETCH_FEATURED_PRODUCTS_SUCCESS,
  FETCH_FEATURED_PRODUCTS_FAILURE,
  FETCH_CATEGORY_PRODUCTS_BEGIN,
  FETCH_CATEGORY_PRODUCTS_SUCCESS,
  FETCH_CATEGORY_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  ADD_PRODUCT,
  DELETE_COMMON_IMAGES_REQUEST,
  DELETE_COMMON_IMAGES_SUCCESS,
  DELETE_COMMON_IMAGES_FAILURE,
  DELETE_VARIANT_IMAGES_REQUEST,
  DELETE_VARIANT_IMAGES_SUCCESS,
  DELETE_VARIANT_IMAGES_FAILURE,
  DELETE_VARIANT_REQUEST,
  DELETE_VARIANT_SUCCESS,
  DELETE_VARIANT_FAILURE,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE
} from './actionTypes';

// Hàm lấy token từ local storage hoặc một nguồn lưu trữ khác
const getToken = () => {
  return sessionStorage.getItem('token');
};

export const fetchProducts = (currentPage = 1, pageSize = 30, filterParams = {}) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
      // Xây dựng URL với tham số lọc và phân trang
      let queryParams = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        ...filterParams // Thêm các tham số lọc vào query
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/products?${queryParams}`);
      const data = await response.json();
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error });
    }
  };
};

//Hàm fetch All Products
export const fetchAllProducts = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/allProducts`);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };
};


// Hàm lấy chi tiết sản phẩm
export const fetchProductDetails = (productId) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCT_DETAILS_REQUEST });
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`);
    const data = await response.json();
    dispatch({ type: FETCH_PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_PRODUCT_DETAILS_FAILURE, payload: error.toString() });
  }
};

// Hàm lấy sản phẩm liên quan
export const fetchRelatedProducts = (productId) => async (dispatch) => {
  dispatch({ type: FETCH_RELATED_PRODUCTS_REQUEST });
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/related`);
    const data = await response.json();
    dispatch({ type: FETCH_RELATED_PRODUCTS_SUCCESS, payload: data.data }); // Assuming the API returns an object with a 'data' array
  } catch (error) {
    dispatch({ type: FETCH_RELATED_PRODUCTS_FAILURE, payload: error.toString() });
  }
};

// Hàm lấy sản phẩm nổi bật
export const fetchFeaturedProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_FEATURED_PRODUCTS_REQUEST });
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products/featured`);
    const data = await response.json();
    dispatch({ type: FETCH_FEATURED_PRODUCTS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: FETCH_FEATURED_PRODUCTS_FAILURE, payload: error.message });
  }
};

// Hàm lấy sản phẩm theo category
export const fetchCategoryProducts = (categoryId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CATEGORY_PRODUCTS_BEGIN });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/category/${categoryId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      dispatch({
        type: FETCH_CATEGORY_PRODUCTS_SUCCESS,
        payload: { products: data.data, categoryName: data.categoryName }
      });
    } catch (error) {
      dispatch({
        type: FETCH_CATEGORY_PRODUCTS_FAILURE,
        payload: { error: error.message }
      });
    }
  };
};

// Hàm search sản phẩm
export const searchProducts = (query) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search?query=${query}`);
      const data = await response.json();
      console.log(data);
      dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: error });
    }
  };
};

// Add Product
export const addProduct = (productData) => {
  return async (dispatch) => {
    const token = getToken();
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      dispatch({ type: ADD_PRODUCT, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };
};

// Action for uploading common images standalone
export const uploadCommonImagesStandalone = (formData) => {
  return async (dispatch) => {
    const token = getToken();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/upload/commonImages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to upload common images');
      }
      const data = await response.json();
      console.log(data);
      return data.imageUrls;
    } catch (error) {
      console.error('Error uploading common images:', error);
      throw error;
    }
  };
};

// Action for uploading variant images standalone
export const uploadVariantImagesStandalone = (formData) => {
  return async (dispatch) => {
    const token = getToken();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/upload/variantImages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to upload variant images');
      }
      const data = await response.json();
      return data.imageUrls;
    } catch (error) {
      console.error('Error uploading variant images:', error);
      throw error;
    }
  };
};

// Action for uploading common images
export const uploadCommonImages = (productId, formData) => {
  return async (dispatch) => {
    const token = getToken();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/upload/commonImages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to upload common images');
      }
      const data = await response.json();
      return data.product.commonImages;
    } catch (error) {
      console.error('Error uploading common images:', error);
      throw error;
    }
  };
};

// Action for uploading variant images
export const uploadVariantImages = (productId, variantSlug, formData) => {
  return async (dispatch) => {
    const token = getToken();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/variants/${variantSlug}/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to upload variant images');
      }
      const data = await response.json();
      // Xác định xem đây có phải là new variant không
      if (!data.product) {
        // Nếu không có product trong data, coi như là new variant
        return data.imageUrls;
      } else {
        const variant = data.product.variants.find(v => v.slug === variantSlug);
        if (!variant) {
          throw new Error('Variant not found');
        }
        return variant.imageUrl;
      }
    } catch (error) {
      console.error('Error uploading variant images:', error);
      throw error;
    }
  };
};

// Update Product
export const updateProduct = (id, updatedProduct) => {
  return async (dispatch) => {
    const token = getToken();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });
      if (!response.ok) {
        throw new Error('Could not update the product');
      }
      const data = await response.json();
      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PRODUCT_FAIL,
        error: error.message
      });
    }
  };
};

// Action creators for deleting commonImages
export const deleteCommonImagesRequest = () => ({
  type: DELETE_COMMON_IMAGES_REQUEST,
});

export const deleteCommonImagesSuccess = (productId, updatedProduct) => ({
  type: DELETE_COMMON_IMAGES_SUCCESS,
  productId,
  updatedProduct,
});

export const deleteCommonImagesFailure = (error) => ({
  type: DELETE_COMMON_IMAGES_FAILURE,
  error,
});

export const deleteCommonImages = (productId, imageUrls) => {
  return async (dispatch) => {
    dispatch(deleteCommonImagesRequest());
    const token = getToken();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/deleteCommonImages`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrls })
      });
      if (!response.ok) {
        throw new Error('Failed to delete common images');
      }
      const updatedProduct = await response.json();
      dispatch(deleteCommonImagesSuccess(productId, updatedProduct));
    } catch (error) {
      dispatch(deleteCommonImagesFailure(error.message));
    }
  };
};

// Action creators for deleting variantImages
export const deleteVariantImagesRequest = () => ({
  type: DELETE_VARIANT_IMAGES_REQUEST,
});

export const deleteVariantImagesSuccess = (productId, updatedProduct) => ({
  type: DELETE_VARIANT_IMAGES_SUCCESS,
  productId,
  updatedProduct,
});

export const deleteVariantImagesFailure = (error) => ({
  type: DELETE_VARIANT_IMAGES_FAILURE,
  error,
});

export const deleteVariantImages = (productId, variantSlug, imageUrls) => {
  return async (dispatch) => {
    dispatch(deleteVariantImagesRequest());
    const token = getToken();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/variants/${variantSlug}/deleteImages`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrls })
      });
      if (!response.ok) {
        throw new Error('Failed to delete variant images');
      }
      const updatedProduct = await response.json();
      dispatch(deleteVariantImagesSuccess(productId, updatedProduct));
    } catch (error) {
      dispatch(deleteVariantImagesFailure(error.message));
    }
  };
};


// Action creators for deleting a variant
export const deleteVariantRequest = () => ({
  type: DELETE_VARIANT_REQUEST,
});

export const deleteVariantSuccess = (productId, updatedProduct) => ({
  type: DELETE_VARIANT_SUCCESS,
  productId,
  updatedProduct,
});

export const deleteVariantFailure = (error) => ({
  type: DELETE_VARIANT_FAILURE,
  error,
});

export const deleteVariant = (productId, variantSlug) => {
  return async (dispatch) => {
    dispatch(deleteVariantRequest());
    const token = getToken();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/variants/${variantSlug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete variant');
      }
      const updatedProduct = await response.json();
      dispatch(deleteVariantSuccess(productId, updatedProduct));
    } catch (error) {
      dispatch(deleteVariantFailure(error.message));
    }
  };
};

// Delete Product
export const deleteProduct = (id) => async (dispatch) => {
  const token = getToken();
  dispatch({ type: DELETE_PRODUCT_REQUEST });
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete the product');
    }

    dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: id });
    return response.json();
  } catch (error) {
    dispatch({ type: DELETE_PRODUCT_FAILURE, payload: error.message });
  }
};
