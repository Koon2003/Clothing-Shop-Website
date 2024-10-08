// FetchProduct Action Types
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

// Product CRUD Action Types
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAIL = 'UPDATE_PRODUCT_FAIL';

export const DELETE_PRODUCT_REQUEST = 'DELETE_PRODUCT_REQUEST';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'DELETE_PRODUCT_FAILURE';

//FetchProductDetails Action Types
export const FETCH_PRODUCT_DETAILS_REQUEST = 'FETCH_PRODUCT_DETAILS_REQUEST';
export const FETCH_PRODUCT_DETAILS_SUCCESS = 'FETCH_PRODUCT_DETAILS_SUCCESS';
export const FETCH_PRODUCT_DETAILS_FAILURE = 'FETCH_PRODUCT_DETAILS_FAILURE';


//FetchRelatedProducts Action Types
export const FETCH_RELATED_PRODUCTS_REQUEST = 'FETCH_RELATED_PRODUCTS_REQUEST';
export const FETCH_RELATED_PRODUCTS_SUCCESS = 'FETCH_RELATED_PRODUCTS_SUCCESS';
export const FETCH_RELATED_PRODUCTS_FAILURE = 'FETCH_RELATED_PRODUCTS_FAILURE';

//FetchFeaturedProducts Action Types
export const FETCH_FEATURED_PRODUCTS_REQUEST = 'FETCH_FEATURED_PRODUCTS_REQUEST';
export const FETCH_FEATURED_PRODUCTS_SUCCESS = 'FETCH_FEATURED_PRODUCTS_SUCCESS';
export const FETCH_FEATURED_PRODUCTS_FAILURE = 'FETCH_FEATURED_PRODUCTS_FAILURE';

//FetchCategoryProducts Action Types
export const FETCH_CATEGORY_PRODUCTS_BEGIN = 'FETCH_CATEGORY_PRODUCTS_BEGIN';
export const FETCH_CATEGORY_PRODUCTS_SUCCESS = 'FETCH_CATEGORY_PRODUCTS_SUCCESS';
export const FETCH_CATEGORY_PRODUCTS_FAILURE = 'FETCH_CATEGORY_PRODUCTS_FAILURE';

//Cart Action Types
export const ADD_TO_CART = 'ADD_TO_CART';
export const CLEAR_CART = 'CLEAR_CART';

// Voucher Action Types
export const CHECK_VOUCHER_REQUEST = 'CHECK_VOUCHER_REQUEST';
export const VOUCHER_CHECK_SUCCESS = 'VOUCHER_CHECK_SUCCESS';
export const VOUCHER_CHECK_FAIL = 'VOUCHER_CHECK_FAIL';

export const FETCH_VOUCHERS_REQUEST = 'FETCH_VOUCHERS_REQUEST';
export const FETCH_VOUCHERS_SUCCESS = 'FETCH_VOUCHERS_SUCCESS';
export const FETCH_VOUCHERS_FAIL = 'FETCH_VOUCHERS_FAIL';

export const ADD_VOUCHER_REQUEST = 'ADD_VOUCHER_REQUEST';
export const ADD_VOUCHER_SUCCESS = 'ADD_VOUCHER_SUCCESS';
export const ADD_VOUCHER_FAIL = 'ADD_VOUCHER_FAIL';

export const UPDATE_VOUCHER_REQUEST = 'UPDATE_VOUCHER_REQUEST';
export const UPDATE_VOUCHER_SUCCESS = 'UPDATE_VOUCHER_SUCCESS';
export const UPDATE_VOUCHER_FAIL = 'UPDATE_VOUCHER_FAIL';

export const DELETE_VOUCHER_REQUEST = 'DELETE_VOUCHER_REQUEST';
export const DELETE_VOUCHER_SUCCESS = 'DELETE_VOUCHER_SUCCESS';
export const DELETE_VOUCHER_FAIL = 'DELETE_VOUCHER_FAIL';

// Search Action Types
export const SEARCH_PRODUCTS_REQUEST = 'SEARCH_PRODUCTS_REQUEST';
export const SEARCH_PRODUCTS_SUCCESS = 'SEARCH_PRODUCTS_SUCCESS';
export const SEARCH_PRODUCTS_FAILURE = 'SEARCH_PRODUCTS_FAILURE';

// Provinces Action Types
export const FETCH_PROVINCES_REQUEST = 'FETCH_PROVINCES_REQUEST';
export const FETCH_PROVINCES_SUCCESS = 'FETCH_PROVINCES_SUCCESS';
export const FETCH_PROVINCES_FAILURE = 'FETCH_PROVINCES_FAILURE';

// Authentication Types
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const SET_USER = 'SET_USER';

// Categories action types
export const FETCH_CATEGORIES_REQUEST = 'FETCH_CATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

export const ADD_CATEGORY_REQUEST = 'ADD_CATEGORY_REQUEST';
export const ADD_CATEGORY_SUCCESS = 'ADD_CATEGORY_SUCCESS';
export const ADD_CATEGORY_FAILURE = 'ADD_CATEGORY_FAILURE';

export const UPDATE_CATEGORY_REQUEST = 'UPDATE_CATEGORY_REQUEST';
export const UPDATE_CATEGORY_SUCCESS = 'UPDATE_CATEGORY_SUCCESS';
export const UPDATE_CATEGORY_FAILURE = 'UPDATE_CATEGORY_FAILURE';

export const DELETE_CATEGORY_REQUEST = 'DELETE_CATEGORY_REQUEST';
export const DELETE_CATEGORY_SUCCESS = 'DELETE_CATEGORY_SUCCESS';
export const DELETE_CATEGORY_FAILURE = 'DELETE_CATEGORY_FAILURE';


// Action types for deleting commonImages
export const DELETE_COMMON_IMAGES_REQUEST = 'DELETE_COMMON_IMAGES_REQUEST';
export const DELETE_COMMON_IMAGES_SUCCESS = 'DELETE_COMMON_IMAGES_SUCCESS';
export const DELETE_COMMON_IMAGES_FAILURE = 'DELETE_COMMON_IMAGES_FAILURE';

// Action types for deleting variantImages
export const DELETE_VARIANT_IMAGES_REQUEST = 'DELETE_VARIANT_IMAGES_REQUEST';
export const DELETE_VARIANT_IMAGES_SUCCESS = 'DELETE_VARIANT_IMAGES_SUCCESS';
export const DELETE_VARIANT_IMAGES_FAILURE = 'DELETE_VARIANT_IMAGES_FAILURE';

// Action types for deleting a variant
export const DELETE_VARIANT_REQUEST = 'DELETE_VARIANT_REQUEST';
export const DELETE_VARIANT_SUCCESS = 'DELETE_VARIANT_SUCCESS';
export const DELETE_VARIANT_FAILURE = 'DELETE_VARIANT_FAILURE';

// Fetch Customers Action Types
export const FETCH_CUSTOMERS_REQUEST = 'FETCH_CUSTOMERS_REQUEST';
export const FETCH_CUSTOMERS_SUCCESS = 'FETCH_CUSTOMERS_SUCCESS';
export const FETCH_CUSTOMERS_FAILURE = 'FETCH_CUSTOMERS_FAILURE';

//Update Customers Action Types
export const UPDATE_CUSTOMER_REQUEST = 'UPDATE_CUSTOMER_REQUEST';
export const UPDATE_CUSTOMER_SUCCESS = 'UPDATE_CUSTOMER_SUCCESS';
export const UPDATE_CUSTOMER_FAILURE = 'UPDATE_CUSTOMER_FAILURE';

//Delete Customers Action Types
export const DELETE_CUSTOMER_SUCCESS = 'DELETE_CUSTOMER_SUCCESS';
export const DELETE_CUSTOMER_FAIL = 'DELETE_CUSTOMER_FAIL';

//Fetch Orders Action Types
export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';

//Update Orders Action Types
export const UPDATE_ORDER_REQUEST = 'UPDATE_ORDER_REQUEST';
export const UPDATE_ORDER_SUCCESS = 'UPDATE_ORDER_SUCCESS';
export const UPDATE_ORDER_FAILURE = 'UPDATE_ORDER_FAILURE';

//Create Order Action Types
export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';

//Delete Order Action Types
export const DELETE_ORDER_REQUEST = 'DELETE_ORDER_REQUEST';
export const DELETE_ORDER_SUCCESS = 'DELETE_ORDER_SUCCESS';
export const DELETE_ORDER_FAILURE = 'DELETE_ORDER_FAILURE';

//Fetch Collections Action Types
export const FETCH_COLLECTIONS_REQUEST = 'FETCH_COLLECTIONS_REQUEST';
export const FETCH_COLLECTIONS_SUCCESS = 'FETCH_COLLECTIONS_SUCCESS';
export const FETCH_COLLECTIONS_FAILURE = 'FETCH_COLLECTIONS_FAILURE';

//Create Collection Action Types
export const CREATE_COLLECTION_SUCCESS = 'CREATE_COLLECTION_SUCCESS';
export const CREATE_COLLECTION_FAILURE = 'CREATE_COLLECTION_FAILURE';

//Update Collection Action Types
export const UPDATE_COLLECTION_SUCCESS = 'UPDATE_COLLECTION_SUCCESS';
export const UPDATE_COLLECTION_FAILURE = 'UPDATE_COLLECTION_FAILURE';

//Delete Collection Action Types
export const DELETE_COLLECTION_SUCCESS = 'DELETE_COLLECTION_SUCCESS';
export const DELETE_COLLECTION_FAILURE = 'DELETE_COLLECTION_FAILURE';

