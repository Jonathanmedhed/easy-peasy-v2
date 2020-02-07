import axios from 'axios';
import { setAlert } from './alerts';

import {
  SUPPLIER_ERROR,
  CREATE_SUPPLIER,
  DELETE_SUPPLIER,
  UPDATE_SUPPLIER,
  UPDATE_PRODUCT,
  PRODUCT_ERROR,
  GET_SUPPLIER
} from '../actions/types';

// Get supplier
export const getSupplierById = ({id}) => async dispatch => {
  try {
    console.log("action running")
    const res = await axios.get(`/api/supplier/${id}`);
    console.log(res.data);
    dispatch({
      type: GET_SUPPLIER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SUPPLIER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create supplier
export const createSupplier = ({
  contactName,
  companyName,
  email
}) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ contactName, companyName, email });

  try {
    const res = await axios.post('/api/supplier', body, config);

    dispatch({
      type: CREATE_SUPPLIER,
      payload: res.data
    });
    
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: SUPPLIER_ERROR
    });
  }
};

// Delete supplier
export const deleteSupplier = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/supplier/${id}`);

    dispatch({
      type: DELETE_SUPPLIER,
      payload: res.data
    });

    dispatch(setAlert('Supplier Removed', 'success'));
  } catch (err) {
    dispatch({
      type: SUPPLIER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete product
export const deleteProduct = (id, product_id) => async dispatch => {
  try {
    const res = await axios.delete(`/api/supplier/product/${id}/${product_id}`);

    dispatch({
      type: UPDATE_PRODUCT,
      payload: res.data
    });

    dispatch(setAlert('Product Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add product
export const addProduct = ({ id, name, brand, unit }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ name, brand, unit });

  try {
    const res = await axios.post(`/api/supplier/product/${id}`, body, config);

    dispatch({
      type: UPDATE_SUPPLIER,
      payload: res.data
    });

    dispatch(setAlert('Product Added', 'success'));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
