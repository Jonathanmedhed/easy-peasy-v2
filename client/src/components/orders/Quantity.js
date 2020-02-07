import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { deleteProduct } from '../../actions/suppliers';
import { setAlert } from '../../actions/alerts';
import { connect } from 'react-redux';
import axios from 'axios';
import { addProduct } from '../../actions/orders';

const Quantity = ({
  setAlert,
  order_id,
  product,
  toggle,
  display,
  products,
  items,
  setProducts,
  setItems
}) => {
  const [formData, setFormData] = useState({
    qty: 0,
    email: 'empty'
  });

  const { qty, email } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ qty, email });

    await axios.post(
      `/api/order/product/${order_id}/${product._id}`,
      body,
      config
    );
    products.splice(products.indexOf(product), 1);
    product.qty = qty;
    items.unshift(product);
    setItems(items);
    setProducts(products);
    setAlert('Product Added', 'success');
    toggle(!display);
  };

  return (
    <Fragment>
      <table className='form-sm bg-light'>
        <thead class='bg-primary'>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>
              <i
                onClick={() => toggle(!display)}
                className='fas fa-times-circle'
              ></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{product.name}</td>
            <td>
              <input
                onChange={e => onChange(e)}
                type='number'
                name='qty'
                value={qty < 0 ? 0 : qty}
              ></input>
               <span> {product.unit}</span>
              <div className='buttons-qty'>
                <button
                  onClick={() => setFormData({ qty: qty - 1 })}
                  className='btn btn-danger'
                >
                  -
                </button>
                <button
                  onClick={() => setFormData({ qty: qty + 1 })}
                  className='btn btn-success'
                >
                  +
                </button>
              </div>
            </td>
            <td>
              <button onClick={() => onSubmit()} className='btn btn-primary'>
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
};

Quantity.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Quantity);
