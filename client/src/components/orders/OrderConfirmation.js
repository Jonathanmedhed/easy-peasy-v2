import React, { Fragment, useEffect, useState, createRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import axios from 'axios';
import Dialog from './Dialog';
import Alert from '../layout/Alert';
import FavForm from './FavForm';
import EditEmailForm from './EditEmailForm';

const OrderConfirmation = ({ auth: { user }, match }) => {
  const [currentSupplier, setCurrentSupplier] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [displayAddedFavourite, toggleAddedFavourite] = useState(false);
  const [displayFavError, toggleFavError] = useState(false);
  const [displayCancelOrder, toggleCancelOrder] = useState(false);
  const [displayEditEmail, toggleEditEmail] = useState(false);
  const [displayEditEmailMobile, toggleEditEmailMobile] = useState(false);
  const [displayAddToFav, toggleAddToFav] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    favourite: ''
  });

  const { email, favourite } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (match.params.id) {
      const fetchData = async () => {
        const result = await axios.get(`/api/order/${match.params.id}`);
        setSuppliers(result.data.suppliers);
        setCurrentSupplier(result.data.suppliers[0]);
        setFormData({
          ...formData,
          email: result.data.suppliers[0].emailToSend
        });
        setProducts(result.data.products);
      };
      fetchData();
    }
  }, []);

  const selectSupplier = supplier => {
    setCurrentSupplier(supplier);
    setFormData({ ...formData, email: supplier.emailToSend });
  };

  const favOrder = async (id, fav) => {
    if (fav) {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const body = JSON.stringify({ fav });

      const result = await axios.post(`/api/order/fav/${id}`, body, config);

      toggleAddedFavourite(!displayAddedFavourite);
    } else {
      toggleFavError(!displayFavError);
    }
  };

  const sendEmail = async (email, subject, text) => {
    const emailToSend = {
      from: '',
      to: email,
      subject: subject,
      text: text
    };

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ emailToSend });

    await axios.post(`/api/users/send-email`, body, config);
  };

  const confirmOrder = async (id, suppliers) => {
    suppliers.forEach(supplier =>
      sendEmail(supplier.email, `Order`, supplier.emailToSend)
    );
    await axios.post(`/api/order/sent/${id}`);
  };

  const selectEditEmail = (supplier) => {
    setCurrentSupplier(supplier);
    toggleEditEmailMobile(!displayEditEmailMobile)
  };

  return (
    <Fragment>
      {user === null ? (
        <Spinner />
      ) : (
        <Fragment>
          {displayAddToFav && (
            <FavForm
              id={match.params.id}
              toggle={toggleAddToFav}
              display={displayAddToFav}
            />
          )}
          {displayAddedFavourite && (
            <Dialog
              id={match.params.id}
              toggle={toggleAddedFavourite}
              display={displayAddedFavourite}
              alertMessage={'Added to Favourites'}
              alertType={'success'}
              header={'Notice'}
              message={'Added to Favourites'}
              action={'continue'}
            />
          )}
          {displayFavError && (
            <Dialog
              id={match.params.id}
              toggle={toggleAddedFavourite}
              display={displayAddedFavourite}
              alertMessage={'Assign a name to order'}
              alertType={'danger'}
              header={'Notice'}
              message={'Assign Name to Order'}
              action={'continue'}
            />
          )}
          {displayCancelOrder && (
            <Dialog
              id={match.params.id}
              toggle={toggleCancelOrder}
              display={displayCancelOrder}
              alertMessage={'Order Deleted'}
              alertMessage={'success'}
              header={'Notice'}
              message={
                'Would you like cancel this order? (Will me removed from system)'
              }
              action={'cancel'}
              cancel={true}
            />
          )}
          <section class='container hide-sm'>
            <h1 class='large text-primary'>Order Confirmation</h1>
            <p class='lead my-2'>Emails to be sent to the suppliers</p>
            <Alert />
            <div class='emails'>
              <table class='table my-1'>
                <thead class='bg-primary'>
                  <th>Supplier</th>
                </thead>
                <tbody>
                  {suppliers.map(supplier => (
                    <tr>
                      <td>
                        <button
                          onClick={() => selectSupplier(supplier)}
                          class={
                            currentSupplier &&
                            currentSupplier._id === supplier._id.toString()
                              ? 'btn btn-dark'
                              : 'btn btn-light'
                          }
                        >
                          {supplier.companyName}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table class='table my-1'>
                <thead class='bg-primary'>
                  <th>Email</th>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <textarea
                        onChange={e => onChange(e)}
                        name='email'
                        value={email}
                      />
                      <div class='email-buttons'>
                        <button
                          onClick={() => toggleEditEmail(!displayEditEmail)}
                          class='btn btn-primary'
                        >
                          Save Changes
                        </button>
                        {displayEditEmail && (
                          <Dialog
                            id={match.params.id}
                            email={email}
                            list={suppliers}
                            setList={setSuppliers}
                            item={currentSupplier}
                            setItem={setCurrentSupplier}
                            toggle={toggleEditEmail}
                            display={displayEditEmail}
                            alertMessage={'Email Edited'}
                            alertType={'success'}
                            header={'Warning'}
                            message={
                              "Change in product's quantity won't be saved on database, continue?"
                            }
                            action={'editEmail'}
                            cancel={true}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class='buttons'>
                <Link to={`/order-details/${match.params.id}`}>
                  <button
                    onClick={() => confirmOrder(match.params.id, suppliers)}
                    class='btn btn-primary'
                  >
                    Confirm & Send
                  </button>
                </Link>
                <input
                  onChange={e => onChange(e)}
                  name='favourite'
                  value={favourite}
                  type='text'
                  placeholder='Order Name'
                ></input>
                <button
                  onClick={() => favOrder(match.params.id, favourite)}
                  class='btn btn-success'
                >
                  Add to Favourites
                </button>
                <Link to={`/edit-order/${match.params.id}`}>
                  <button class='btn btn-caution'>Edit Order</button>
                </Link>
                <button
                  onClick={() => toggleCancelOrder(!displayCancelOrder)}
                  class='btn btn-danger'
                >
                  Cancel Order
                </button>
              </div>
            </div>
            <Alert />
          </section>
          <section class='container show-sm'>
            <h1 class='large text-primary'>Order Confirmation</h1>
            <p class='lead my-1'>Emails to be sent to the suppliers</p>
            <Alert />

            {suppliers.map(supplier => (
              <div class='emails'>
                <table class='table my-1'>
                  <thead class='bg-primary'>
                    <th>{supplier.companyName}</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <textarea
                          onChange={e => onChange(e)}
                          name='email'
                          value={supplier.emailToSend}
                        />
                        {displayEditEmailMobile && (
                          <EditEmailForm
                            currentEmail={currentSupplier.emailToSend}
                            setEmail={setFormData}
                            toggle={toggleEditEmailMobile}
                            display={displayEditEmailMobile}
                            toggleConfirm={toggleEditEmail}
                            displayConfirm={displayEditEmail}
                          />
                        )}
                        {displayEditEmail && (
                          <Dialog
                            id={match.params.id}
                            email={email}
                            list={suppliers}
                            setList={setSuppliers}
                            item={currentSupplier}
                            setItem={setCurrentSupplier}
                            toggle={toggleEditEmail}
                            display={displayEditEmail}
                            alertMessage={'Email Edited'}
                            alertType={'success'}
                            header={'Warning'}
                            message={
                              "Change in product's quantity won't be saved on database, continue?"
                            }
                            action={'editEmail'}
                            cancel={true}
                          />
                        )}
                        <div class='email-buttons'>
                          <button
                            onClick={() => selectEditEmail(supplier)}
                            class='btn btn-primary'
                          >
                            Edit Email
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            <div class='buttons-mobile show-sm'>
              <Link to={`/order-details/${match.params.id}`}>
                <button
                  onClick={() => confirmOrder(match.params.id, suppliers)}
                  class='btn btn-primary'
                >
                  <i class='fas fa-envelope'></i>
                </button>
              </Link>
              <button
                onClick={() => toggleAddToFav(!displayAddToFav)}
                class='btn btn-success'
              >
                <i className='fas fa-star'></i>
              </button>
              <Link to={`/edit-order/${match.params.id}`}>
                <button class='btn btn-caution'>
                  <i class='fas fa-undo-alt'></i>
                </button>
              </Link>
              <button
                onClick={() => toggleCancelOrder(!displayCancelOrder)}
                class='btn btn-danger'
              >
                <i class='fas fa-times-circle'></i>
              </button>
            </div>

            <Alert />
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

OrderConfirmation.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(OrderConfirmation);
