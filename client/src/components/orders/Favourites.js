import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import Dialog from './Dialog';
import SearchBox from '../layout/SearchBox';
import Alert from '../layout/Alert';
import axios from 'axios';

const Favourites = ({ auth: { user } }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [displayRemoveFavorite, toggleRemoveFavorite] = useState(false);
  const [favourites, setFavourites] = useState([]);

  const [formData, setFormData] = useState({
    query: ''
  });

  const { query } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const setData = async () => {
      const res = await axios.get(`/api/order/`);
      setFavourites(res.data.filter(order => order.fav !== 'no'));
    };
    setData();
  }, []);

  const removeFavorite = async order => {
    setCurrentOrder(order);
    toggleRemoveFavorite(!displayRemoveFavorite);
  };

  return (
    <Fragment>
      {favourites === null ? (
        <Spinner />
      ) : (
        <Fragment>
          {displayRemoveFavorite && (
            <Dialog
              id={currentOrder._id}
              toggle={toggleRemoveFavorite}
              display={displayRemoveFavorite}
              alertMessage={'Order Removed'}
              alertType={'success'}
              header={'Notice'}
              message={'Unfavourite Order?'}
              action={'remove'}
              list={favourites}
              setList={setFavourites}
              cancel={true}
            />
          )}

          <section class='container'>
            <h1 class='large text-primary'>
              <i class='fas fa-star'></i> Favourites
            </h1>
            <p class='lead my-1'>Resend or edit favourite orders</p>
            <div class='search'>
              <input
                name='query'
                value={query}
                placeholder='Search by Name'
                type='text'
                className='searchTerm'
                onChange={e => onChange(e)}
              ></input>
              <button type='submit' class='searchButton'>
                <i class='fa fa-search'></i>
              </button>
            </div>
            <Alert />
            <div class='products'>
              <SearchBox
                list={favourites}
                selectItem={removeFavorite}
                query={query}
                data={'favourites'}
              />
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

Favourites.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(Favourites);
