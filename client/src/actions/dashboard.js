import axios from "axios";
import { setAlert } from "./alerts";

import {
  GET_USER,
  GET_SUPPLIERS,
  GET_PRODUCTS,
  GET_ORDERS,
  UPDATE_USER,
  UPDATE_PRODUCT,
  UPDATE_SUPPLIER,
  UPDATE_ORDER,
  USER_ERROR,
  PRODUCT_ERROR,
  SUPPLIER_ERROR,
  ORDER_ERROR,
} from "./types";

//Get user
export const getUser = () => async (dispatch) => {
  try {
    const res = await axios.get(`/users/me`);

    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update user
export const updateUser = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/users/edit", formData, config);

    dispatch(setAlert("User Updated", "success"));
    dispatch({
      type: UPDATE_USER,
      payload: res.data,
    });

    //Redirect can't be used in actions, we need to use history instead
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get user products
export const getProducts = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/products`);

    dispatch({
      type: GET_PRODUCTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get user suppliers
export const getSuppliers = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/suppliers`);

    dispatch({
      type: GET_SUPPLIERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SUPPLIER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Get user orders
export const getOrders = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/orders`);

    dispatch({
      type: GET_ORDERS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete product
export const deleteProduct = (id, product_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/supplier/product/${id}/${product_id}`);

    dispatch({
      type: UPDATE_PRODUCT,
      payload: res.data,
    });

    dispatch(setAlert("Product Removed", "success"));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/order/${id}`);

    dispatch({
      type: UPDATE_ORDER,
      payload: res.data,
    });

    dispatch(setAlert("Order Removed", "success"));
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
