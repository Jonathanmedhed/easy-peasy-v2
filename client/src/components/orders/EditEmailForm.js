import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';
import { setAlert } from '../../actions/alerts';
import { connect } from 'react-redux';
import axios from 'axios';
import Dialog from './Dialog';

const EditEmailForm = ({
  setEmail,
  toggle,
  display,
  toggleConfirm,
  displayConfirm,
  currentEmail
}) => {
  const [formData, setFormData] = useState({
    emailToSend: currentEmail
  });

  const { emailToSend } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    toggleConfirm(!displayConfirm);
    toggle(!display);
    setEmail({ ...formData, email: emailToSend });
  };

  return (
    <Fragment>
      <div class='form-sm-email bg-light'>
        <div class='form-sm-header bg-primary'>
          <p></p>
          <p className='lead'>Edit Email</p>
          <i
            onClick={() => toggle(!display)}
            className='fas fa-times-circle dialog'
          ></i>
        </div>
        <Alert />
        <div class='form-sm-body'>
          <textarea
            onChange={e => onChange(e)}
            name='emailToSend'
            value={emailToSend}
          />
        </div>
        <div class='form-sm-footer'>
          <button onClick={e => onSubmit(e)} class='btn btn-primary'>
            Save
          </button>
          <button onClick={() => toggle(!display)} className='btn btn-danger'>
            Cancel
          </button>
        </div>
      </div>
    </Fragment>
  );
};

EditEmailForm.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(EditEmailForm);
