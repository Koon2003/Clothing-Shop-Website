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
} from "./actionTypes";

export const fetchCollections = () => async (dispatch) => {
    dispatch({ type: FETCH_COLLECTIONS_REQUEST });
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/collections`);
        const data = await response.json();
        dispatch({ type: FETCH_COLLECTIONS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_COLLECTIONS_FAILURE, payload: error.message });
    }
};

export const createCollection = (collection) => async (dispatch) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/collections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collection)
        });
        const data = await response.json();
        dispatch({ type: CREATE_COLLECTION_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: CREATE_COLLECTION_FAILURE, payload: error.message });
    }
};

export const updateCollection = (id, collection) => async (dispatch) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/collections/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collection)
        });
        const data = await response.json();
        dispatch({ type: UPDATE_COLLECTION_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_COLLECTION_FAILURE, payload: error.message });
    }
}

export const deleteCollection = (id) => async (dispatch) => {
    try {
        await fetch(`${process.env.REACT_APP_API_URL}/collections/${id}`, {
            method: 'DELETE'
        });
        dispatch({ type: DELETE_COLLECTION_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_COLLECTION_FAILURE, payload: error.message });
    }
};
