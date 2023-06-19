import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';
import { createSupplier } from '../../actions/suppliers';
import { setAlert } from '../../actions/alerts';
import { connect } from 'react-redux';
import axios from 'axios';

const SupplierForm = ({
  setAlert,
  createSupplier,
  toggle,
  display,
  supplier,
  list,
  setList,
  cancel,
  action
}) => {
  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    email: '',
    email2: ''
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        contactName: !supplier.contactName ? '' : supplier.contactName,
        companyName: !supplier.companyName ? '' : supplier.companyName,
        email: !supplier.email ? '' : supplier.email,
        email2: !supplier.email ? '' : supplier.email
      });
    }
  }, []);

  const { contactName, companyName, email, email2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ contactName, companyName, email });

    if (email !== email2) {
      setAlert('Emails do not match', 'danger');
    }
    /**
     * If there is a supplier to edit
     */
    if (supplier) {
      const res = await axios.post(
        `/api/supplier/edit/${supplier._id}`,
        body,
        config
      );
      //If there is a list of suppliers, modify list, else just set the supplier
      if (list) {
        list.splice(list.indexOf(supplier), 1);
        list.unshift(res.data);
        setList(list);
      } else {
        setList(res.data);
      }
      setAlert('Supplier edited', 'success');
      toggle(!display);
    } else {
      //createSupplier({ contactName, companyName, email });

      const res = await axios.post(`/${API}/supplier', body, config);
      list.unshift(res.data);
      setList(list);
      setAlert('Supplier created', 'success');
      toggle(!display);
    }
  };

  return (
    <Fragment>
      <form onSubmit={e => onSubmit(e)} class='form-sm bg-light'>
        <div class='form-sm-header bg-primary'>
          <p></p>
          <p className='lead'>{action === 'edit' ? ('Edit') : ('New Supplier')}</p>
          <i
            onClick={() => toggle(!display)}
            className='fas fa-times-circle dialog'
          ></i>
        </div>
        <Alert/>
        <div class='form-sm-body'>
          <div class='form-group'>
            <input
              name='companyName'
              value={companyName}
              onChange={e => onChange(e)}
              type='text'
              placeholder='Company Name'
            ></input>
          </div>
          <div class='form-group'>
            <input
              name='contactName'
              value={contactName}
              onChange={e => onChange(e)}
              type='text'
              placeholder='Contact Name'
            ></input>
          </div>
          <div class='form-group'>
            <input
              name='email'
              value={email}
              onChange={e => onChange(e)}
              type='text'
              placeholder='Email'
            ></input>
          </div>
          <div class='form-group'>
            <input
              name='email2'
              value={email2}
              onChange={e => onChange(e)}
              type='text'
              placeholder='Confirm Email'
            ></input>
          </div>
        </div>
        <div class='form-sm-footer'>
          <input type='submit' value={action === 'edit' ? ('Edit') : ('Create')} class='btn btn-primary'></input>
          {cancel && (
            <button onClick={() => toggle(!display)} className='btn btn-danger'>
              Cancel
            </button>
          )}
        </div>
      </form>
    </Fragment>
  );
};

SupplierForm.propTypes = {
  setAlert: PropTypes.func.isRequired,
  createSupplier: PropTypes.func.isRequired
};

export default connect(null, { setAlert, createSupplier })(SupplierForm);
