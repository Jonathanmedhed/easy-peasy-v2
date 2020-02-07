import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { updateOrder } from '../../actions/orders';
import { setAlert } from '../../actions/alerts';
import { connect } from 'react-redux';
import axios from 'axios';

const Dialog = ({
  setAlert,
  id,
  toggle,
  display,
  alertMessage,
  alertType,
  header,
  message,
  action,
  list,
  email,
  item,
  setList,
  setItem,
  cancel
}) => {
  const onSubmit = async e => {
    setAlert(alertMessage, alertType);
    if (action === 'remove') {
      await axios.post(`/api/order/nofav/${id}`);
      const order = await axios.get(`/api/order/${id}`);
      list.splice(list.indexOf(order), 1);
      setList(list);
      toggle(!display);
    }
    if (action === 'continue') {
      toggle(!display);
    }
    if (action === 'editEmail') {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      let emailToSend = email;
      const body = JSON.stringify({ emailToSend });

      const result = await axios.post(
        `/api/order/${id}/${item._id}`,
        body,
        config
      );

      // Update suppliers list and current supplier
      list.splice(list.indexOf(item), 1);
      item.emailToSend = emailToSend;
      list.unshift(item);
      setList(list);
      setItem(item);
      toggle(!display);
    }
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
          {action === 'redirect' ? (
            <Link to='/dashboard'>
              <button
                onClick={() => toggle(!display)}
                className='btn btn-success'
              >
                ok
              </button>
            </Link>
          ) : (
            <input type='submit' value='ok' className='btn btn-success'></input>
          )}

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

Dialog.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Dialog);
