import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alerts';
import PropTypes from 'prop-types';
import Alert from '../layout/Alert';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    email: '',
    email2: '',
    password: '',
    password2: ''
  });

  const {
    contactName,
    companyName,
    email,
    email2,
    password,
    password2
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Password do not match', 'danger');
    } else {
      register({ contactName, companyName, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <section className='landing'>
        <div className='dark-overlay'>
          <div className='container-register'>
            <h1 className='large text-light'>Register</h1>
            <p className='lead text-light'>
              <i className='fas fa-user'></i> Create Your Account
            </p>
            <form onSubmit={e => onSubmit(e)} className='form'>
              <div className='form-group'>
                <input
                  name='companyName'
                  value={companyName}
                  onChange={e => onChange(e)}
                  type='text'
                  placeholder='Company Name'
                />
              </div>
              <div className='form-group'>
                <input
                  name='contactName'
                  value={contactName}
                  onChange={e => onChange(e)}
                  type='text'
                  placeholder='Contact Name'
                />
              </div>
              <div className='form-group'>
                <input
                  name='email'
                  value={email}
                  onChange={e => onChange(e)}
                  type='email'
                  placeholder='Email Address'
                />
              </div>
              <div className='form-group'>
                <input
                  name='email2'
                  value={email2}
                  onChange={e => onChange(e)}
                  type='email'
                  placeholder='Confirm Email'
                />
              </div>
              <div className='form-group'>
                <input
                  name='password'
                  value={password}
                  onChange={e => onChange(e)}
                  type='password'
                  placeholder='Password'
                />
              </div>
              <div className='form-group'>
                <input
                  name='password2'
                  value={password2}
                  onChange={e => onChange(e)}
                  type='password'
                  placeholder='Confirm Password'
                />
              </div>
              <Alert />
              <input
                type='submit'
                value='Register'
                className='btn btn-primary'
              />
              <p className='text-light'>
                Already have an account?{' '}
                <Link to='/login'>
                  <button className='btn btn-dark'>Sign In</button>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
