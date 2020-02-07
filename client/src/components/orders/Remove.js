import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { deleteProduct } from '../../actions/suppliers';
import { setAlert } from '../../actions/alerts';
import { connect } from 'react-redux';
import axios from 'axios';
import { addProduct } from '../../actions/orders';

const Remove = ({
  setAlert,
  toggle,
  display,
  header,
  message,
  order_id,
  product,
  products,
  items,
  setProducts,
  setItems
}) => {
  const onSubmit = async e => {

    await axios.delete(
        `/api/order/product/${order_id}/${product._id}`
      );
    items.splice(items.indexOf(product), 1);
    product.qty = '0';
    products.unshift(product);
    setItems(items);
    setProducts(products);
    setAlert('Item Removed', 'success');
    toggle(!display);
  };

  return (
    <Fragment>
      <form onSubmit={e => onSubmit(e)} className='form-sm bg-light'>
        <div className='form-sm-header bg-danger'>
          <p></p>
          <p className='lead'>{header}</p>
          <i
            onClick={() => toggle(!display)}
            className='fas fa-times-circle dialog'
          ></i>
        </div>
        <div className='form-sm-body'>
          <p className='p-1'>{message}</p>
        </div>
        <div className='form-sm-footer'>
          <input type='submit' value='ok' className='btn btn-danger'></input>
        </div>
      </form>
    </Fragment>
  );
};

Remove.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Remove);
