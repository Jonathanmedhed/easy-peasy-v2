import axios from "axios";
import { setAlert } from "./alerts";
import { GET_FAVS } from "../actions/types";

// Add product to order
export const getFavourites = () => async (dispatch) => {
  console.log("get favo running");
  try {
    const res = await axios.get(`/api/order/`);
    console.log("try running");
    console.log(res.data);
    dispatch({
      type: GET_FAVS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  }
};

// Add product to order
export const addProduct =
  ({ qty, id, product_id }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({ qty, id, product_id });

    try {
      const res = await axios.post(
        `/api/order/product/${id}/${product_id}`,
        body,
        config
      );

      dispatch({
        payload: res.data,
      });
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
    }
  };

// unfavourite order
export const unfavouriteOrder = (id) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/order/${id}/nofav`);

    dispatch(setAlert("Order Updated", "success"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
  }
};

// Remove product from order
export const removeProduct =
  ({ order_id, product, products, items, setProducts, setItems }) =>
  async (dispatch) => {
    try {
      const res = await axios.delete(
        `/api/order/product/${order_id}/${product._id}`
      );
      console.log(res.data);
      console.log(items);
      console.log(products);

      items.splice(items.indexOf(product), 1);
      product.qty = "0";
      products.unshift(product);

      console.log(items);
      console.log(products);

      setItems(items);
      setProducts(products);
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
    }
  };
