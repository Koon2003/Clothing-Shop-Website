import {
  CREATE_COLLECTION_FAILURE,
  CREATE_COLLECTION_SUCCESS,
  DELETE_COLLECTION_FAILURE,
  DELETE_COLLECTION_SUCCESS,
  FETCH_COLLECTIONS_FAILURE,
  FETCH_COLLECTIONS_REQUEST,
  FETCH_COLLECTIONS_SUCCESS,
  UPDATE_COLLECTION_FAILURE,
  UPDATE_COLLECTION_SUCCESS,
} from "../actions/actionTypes";

const initialState = {
  collections: [],
  loading: false,
  error: null,
};

const collectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_COLLECTIONS_REQUEST:
      return { ...state, loading: true };
    case FETCH_COLLECTIONS_SUCCESS:
      return { ...state, loading: false, collections: action.payload };
    case FETCH_COLLECTIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_COLLECTION_SUCCESS:
      // Thêm collection mới vào danh sách collections
      return { ...state, collections: [...state.collections, action.payload] };
    case CREATE_COLLECTION_FAILURE:
      // Cập nhật trạng thái lỗi khi tạo collection mới không thành công
      return { ...state, error: action.payload };

    case UPDATE_COLLECTION_SUCCESS:
      // Cập nhật collection hiện có bằng cách thay thế nó với dữ liệu mới
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection._id === action.payload._id ? action.payload : collection
        ),
      };
    case UPDATE_COLLECTION_FAILURE:
      // Cập nhật trạng thái lỗi khi cập nhật collection không thành công
      return { ...state, error: action.payload };

    case DELETE_COLLECTION_SUCCESS:
      // Lọc bỏ collection đã bị xóa khỏi danh sách collections
      return {
        ...state,
        collections: state.collections.filter(
          (collection) => collection._id !== action.payload
        ),
      };
    case DELETE_COLLECTION_FAILURE:
      // Cập nhật trạng thái lỗi khi xóa collection không thành công
      return { ...state, error: action.payload };
    // ... các trường hợp khác giữ nguyên
    default:
      return state;
  }
};

export default collectionReducer;
