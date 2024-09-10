import { combineReducers } from "redux";
import { productReducer } from "./productReducers";
import userReducer from "./userReducer";
import { customerReducer } from "./customerReducer";
import categoryReducer from "./categoryReducer";
import voucherReducer from "./voucherReducer";
import collectionReducer from "./collectionReducer";
import categoryProductsReducer from "./categoryProductsReducer";
import { featuredProductsReducer } from "./featuredProductsReducer";
import { relatedProductsReducer } from "./relatedProductsReducrer";
import { productDetailsReducer } from "./productDetailsReducer";
import cartReducer from "./cartReducer";
import orderReducer from "./orderReducer";

const rootReducer = combineReducers({
  products: productReducer,
  featuredProducts: featuredProductsReducer,
  relatedProducts: relatedProductsReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  user: userReducer,
  customers: customerReducer,
  category: categoryReducer,
  categoryProducts: categoryProductsReducer,
  voucher: voucherReducer,
  orders: orderReducer,
  collections: collectionReducer,
});

export default rootReducer;
