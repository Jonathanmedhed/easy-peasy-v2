import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const [displayMenu, toggleMenu] = useState(false);
  const authLinks = (
    <ul>
      <li className='hide-sm'>
        <Link to='/favourites'>
          <i class='fas fa-star'></i> <span>Favourites</span>
        </Link>
      </li>
      <li className='hide-sm'>
        <Link to='/create-order'>
          <i className='fas fa-shopping-cart'></i> <span>Create Order</span>
        </Link>
      </li>
      <li className='hide-sm'>
        <Link to='/suppliers'>
          <i className='far fa-address-book'></i> <span>Suppliers</span>
        </Link>
      </li>
      <li className='hide-sm'>
        <Link to='/dashboard'>
          <i className='fas fa-user'></i> <span>Dashboard</span>
        </Link>
      </li>
      <li className='hide-sm'>
        <Link onClick={logout} to='#!'>
          <i className='fas fa-sign-out-alt'></i> <span>Logout</span>
        </Link>
      </li>
      <li className='show-sm'>
        <i
          onClick={() => toggleMenu(!displayMenu)}
          className='fas fa-bars'
        ></i>
      </li>
    </ul>
  );

  const authLinksCollapsed = (
    <ul onClick={() => toggleMenu(!displayMenu)} className='sm-ul'>
      <li>
        <Link to='/favourites'>
          <i className='fas fa-star'></i> <span>Favourites</span>
        </Link>
      </li>
      <li>
        <Link to='/create-order'>
          <i className='fas fa-shopping-cart'></i> <span>Create Order</span>
        </Link>
      </li>
      <li>
        <Link to='/suppliers'>
          {' '}
          <i className='far fa-address-book'></i> <span>Suppliers</span>
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user'></i> <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link onClick={logout} to='#!'>
          <i className='fas fa-sign-out-alt'></i> <span>Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <Fragment>
      <nav className='navbar bg-primary'>
        <h1>
          <Link to='/'>
            <i className='fas fa-code'></i> EasyPeasy
          </Link>
        </h1>
        {!loading && (
          <Fragment> {isAuthenticated ? authLinks : guestLinks}</Fragment>
        )}
      </nav>
      {displayMenu && authLinksCollapsed}
    </Fragment>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
