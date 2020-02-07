import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { deleteSupplier } from '../../actions/suppliers';
import { setAlert } from '../../actions/alerts';
import { connect } from 'react-redux';
import axios from 'axios';

const SupplierDialog = ({
  setAlert,
  deleteSupplier,
  toggle,
  display,
  supplier,
  list,
  setList,
  cancel
}) => {
  const onSubmit = async e => {
    //deleteSupplier({ id });
    await axios.delete(`/api/supplier/${supplier._id}`);
    list.splice(list.indexOf(supplier), 1);
    setList(list);
    toggle(!display);
    setAlert('Supplier deleted', 'success');
  };

  return (
    <Fragment>
      <form onSubmit={e => onSubmit(e)} class='form-sm bg-light'>
        <div class='form-sm-header bg-danger'>
          <p></p>
          <p className='lead'>Delete</p>
          <i
            onClick={() => toggle(!display)}
            className='fas fa-times-circle dialog'
          ></i>
        </div>
        <div class='form-sm-body'>
          <p class='p-1'>Delete Supplier?</p>
        </div>
        <div class='form-sm-footer'>
          <input type='submit' value='Delete' class='btn btn-danger'></input>
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

SupplierDialog.propTypes = {
  setAlert: PropTypes.func.isRequired,
  deleteSupplier: PropTypes.func.isRequired
};

export default connect(null, { setAlert, deleteSupplier })(SupplierDialog);
