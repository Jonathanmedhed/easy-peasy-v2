import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';
import { addProduct } from '../../actions/suppliers';
import { setAlert } from '../../actions/alerts';
import { connect } from 'react-redux';
import axios from 'axios';

const ProductForm = ({
  setAlert,
  addProduct,
  id,
  toggle,
  display,
  product,
  supplier,
  setList,
  list,
  cancel,
  action
}) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    unit: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: !product.name ? '' : product.name,
        brand: !product.brand ? '' : product.brand,
        unit: !product.unit ? '' : product.unit
      });
    }
  }, []);

  const { name, brand, unit } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    //addProduct({ id, name, brand, unit });
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ name, brand, unit });
    if (product) {
      const res = await axios.post(
        `/api/supplier/product-edit/${product.supplier}/${product._id}`,
        body,
        config
      );
      list.splice(list.indexOf(product), 1);
      list.unshift(res.data);
      //setList(list);
      setAlert('Product Edited', 'success');
      toggle(!display);
    }
    if (action === 'justAdd') {
      const res = await axios.post(`/api/supplier/product/${id}`, body, config);
      setAlert('Product Added', 'success');
      toggle(!display);
    } else {
      //createSupplier({ contactName, companyName, email });

      const res = await axios.post(`/api/supplier/product/${id}`, body, config);
      list.unshift(res.data);
      setList(list);
      setAlert('Product Added', 'success');
      toggle(!display);
    }
  };

  return (
    <Fragment>
      <div class='form-sm bg-light'>
        <div class='form-sm-header bg-primary'>
          <p></p>
          <p className='lead'>{action === 'edit' ? 'Edit' : 'New Product'}</p>
          <i
            onClick={() => toggle(!display)}
            className='fas fa-times-circle dialog'
          ></i>
        </div>
        <Alert />
        <div class='form-sm-body'>
          <div class='form-group'>
            <input
              name='name'
              value={name}
              type='text'
              placeholder='Name'
              onChange={e => onChange(e)}
            ></input>
          </div>
          <div class='form-group'>
            <input
              name='brand'
              value={brand}
              type='text'
              placeholder='Brand'
              onChange={e => onChange(e)}
            ></input>
          </div>
          <div class='form-group'>
            <input
              name='unit'
              value={unit}
              type='text'
              placeholder='Unit(kg, box(12), lts)'
              onChange={e => onChange(e)}
            ></input>
          </div>
        </div>
        <div class='form-sm-footer'>
          <button onClick={e => onSubmit(e)} className='btn btn-primary'>
            {action === 'edit' ? 'Edit' : 'Add'}
          </button>
          {cancel && (
            <button onClick={() => toggle(!display)} className='btn btn-danger'>
              Cancel
            </button>
          )}
        </div>
      </div>
    </Fragment>
  );
};

ProductForm.propTypes = {
  setAlert: PropTypes.func.isRequired,
  addProduct: PropTypes.func.isRequired
};

export default connect(null, { setAlert, addProduct })(ProductForm);
