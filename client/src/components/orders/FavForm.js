import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';
import { setAlert } from '../../actions/alerts';
import { connect } from 'react-redux';
import axios from 'axios';

const FavForm = ({ setAlert, id, toggle, display }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {}, []);

  const { name } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async fav => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ fav });

    await axios.post(`/api/order/fav/${id}`, body, config);

    toggle(!display);
    setAlert('Added to Favorites', 'success');
  };

  return (
    <Fragment>
      <form onSubmit={e => onSubmit(e)} class='form-sm bg-light'>
        <div class='form-sm-header bg-primary'>
          <p></p>
          <p className='lead'>Favorite</p>
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
              placeholder='favorite name'
              onChange={e => onChange(e)}
            ></input>
          </div>
        </div>
        <div class='form-sm-footer'>
          <input type='submit' value='Save' class='btn btn-primary'></input>
          <button onClick={() => toggle(!display)} className='btn btn-danger'>
            Cancel
          </button>
        </div>
      </form>
    </Fragment>
  );
};

FavForm.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(FavForm);
