import React, { Fragment, useEffect, useState, createRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import SearchBox from '../layout/SearchBox';
import axios from 'axios';
import Dialog from './Dialog';
import Quantity from './Quantity';
import Remove from './Remove';

const EditOrder = ({ auth: { user }, match }) => {
  // List References
  let itemsRef = createRef();
  let productsRef = createRef();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [itemsList, setItemsList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [displayContinueLater, toggleContinueLater] = useState(false);
  const [displayCancelOrder, toggleCancelOrder] = useState(false);
  const [displayQty, toggleQty] = useState(false);
  const [displayRemoveItem, toggleRemoveItem] = useState(false);
  const [displayScroll, toggleScroll] = useState(true);

  const [formData, setFormData] = useState({
    query: '',
    query2: ''
  });

  const { query, query2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (match.params.id) {
      const fetchData = async () => {
        const result = await axios.get(`/api/order/${match.params.id}`);
        setCurrentOrder(result.data.order);
        setItemsList(result.data.products);
        const res = await axios.get(`/api/users/products`);
        let currentProductsList = res.data;
        for (let item of result.data.products) {
          const index = currentProductsList.findIndex(
            product => product._id == item._id
          );
          if (index > -1) {
            currentProductsList.splice(index, 1);
          }
        }
        setProductsList(currentProductsList);
      };
      fetchData();
    }
  }, []);

  const selectProduct = async product => {
    if (currentOrder) {
      setCurrentProduct(product);
      toggleQty(!displayQty);
    }
  };

  const selectRemoveProduct = async product => {
    if (currentOrder) {
      setCurrentProduct(product);
      toggleRemoveItem(!displayRemoveItem);
    }
  };

  const createEmail = async (supplier, products, user, order) => {
    let emailToSend = '';
    let productsString = '';

    products.forEach(product => {
      if (product.supplier === supplier._id) {
        productsString =
          productsString +
          '\n' +
          product.name +
          ' ' +
          product.brand +
          ' Qty: ' +
          product.qty +
          ' ' +
          product.unit;
      }
    });

    emailToSend =
      'Dear ' +
      supplier.companyName +
      '\n' +
      '\n' +
      user.companyName +
      ' would like to order the following items: \n' +
      productsString +
      '\n\nThis is an auto generated email. \nPlease contact us if there are any issues with the order. \nRegards \n\n' +
      user.contactName +
      '\n' +
      user.companyName +
      '\n' +
      user.email;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ emailToSend });

    const result = await axios.post(
      `/api/order/${order._id}/${supplier._id}`,
      body,
      config
    );
  };

  const generateOrder = async order => {
    const result = await axios.get(`/api/order/${order._id}`);
    const suppliers = result.data.suppliers;
    const products = result.data.products;

    suppliers.forEach(supplier => {
      createEmail(supplier, products, user, order);
    });
    setOrderCompleted(true);
  };

  const scroll = async choice => {
    toggleScroll(!displayScroll);
    if (choice === 'items') {
      window.scrollTo(0, itemsRef.current.offsetTop);
    } else {
      window.scrollTo(0, productsRef.current.offsetTop);
    }
  };

  return (
    <Fragment>
      {user === null ? (
        <Spinner />
      ) : (
        <Fragment>
          {orderCompleted && currentOrder && (
            <Redirect to={`order-confirmation/${currentOrder._id}`} />
          )}
          {displayContinueLater && (
            <Dialog
              id={currentOrder._id}
              toggle={toggleContinueLater}
              display={displayContinueLater}
              alertMessage={'Order Saved'}
              alertMessage={'success'}
              header={'Notice'}
              message={'Would you like continue later?'}
              action={'redirect'}
              cancel={true}
            />
          )}
          {displayQty && (
            <Quantity
              order_id={currentOrder._id}
              product={currentProduct}
              toggle={toggleQty}
              display={displayQty}
              products={productsList}
              items={itemsList}
              setProducts={setProductsList}
              setItems={setItemsList}
            />
          )}
          {displayCancelOrder && (
            <Dialog
              id={currentOrder._id}
              toggle={toggleCancelOrder}
              display={displayCancelOrder}
              alertMessage={'Order Deleted'}
              alertMessage={'success'}
              header={'Notice'}
              message={'Would you like cancel this order?'}
              action={'delete'}
              cancel={true}
            />
          )}
          {displayRemoveItem && (
            <Remove
              order_id={currentOrder._id}
              toggle={toggleRemoveItem}
              display={displayRemoveItem}
              alertMessage={'Item Removed'}
              alertType={'success'}
              header={'Notice'}
              message={'Remove Item?'}
              action={'removeItem'}
              product={currentProduct}
              products={productsList}
              items={itemsList}
              setProducts={setProductsList}
              setItems={setItemsList}
              cancel={true}
            />
          )}
          <section className='container'>
            <h1 className='large text-primary'>Edit Order</h1>
            <div className='show-sm'>
              <p ref={itemsRef} className='lead my-1'>
                Items in order
              </p>
            </div>
            <p ref={itemsRef} className='lead my-2 hide-sm'>
              Items in order
            </p>
            <div class='search'>
              <input
                name='query2'
                value={query2}
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
            <div className='products'>
              <SearchBox
                list={itemsList}
                selectItem={selectRemoveProduct}
                query={query2}
                data={'items'}
              />
              <div className='buttons hide-sm'>
                {currentOrder && (
                  <Link to={`/order-confirmation/${currentOrder._id}`}>
                    <button
                      onClick={() => generateOrder(currentOrder)}
                      className='btn btn-primary'
                    >
                      Send Order
                    </button>
                  </Link>
                )}
                <button
                  onClick={() =>
                    window.scrollTo(0, productsRef.current.offsetTop)
                  }
                  className='btn btn-success'
                >
                  Continue Adding
                </button>
                <button
                  onClick={() => toggleContinueLater(!displayContinueLater)}
                  className='btn btn-caution'
                >
                  Finish
                </button>
              </div>
            </div>
            <p className='lead my-2'>
              Select all items that will be ordered via email
            </p>
            <div ref={productsRef} class='search'>
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
            <div className='products'>
              <SearchBox
                list={productsList}
                selectItem={selectProduct}
                query={query}
                data={'products'}
              />
              <div className='buttons  hide-sm'>
                {currentOrder && (
                  <Link to={`/order-confirmation/${currentOrder._id}`}>
                    <button
                      onClick={() => generateOrder(currentOrder)}
                      className='btn btn-primary'
                    >
                      Send Order
                    </button>
                  </Link>
                )}
                <button
                  onClick={() => window.scrollTo(0, itemsRef.current.offsetTop)}
                  className='btn btn-success'
                >
                  Check Cart
                </button>
                <button
                  onClick={() => toggleContinueLater(!displayContinueLater)}
                  className='btn btn-caution'
                >
                  Finish
                </button>
              </div>
            </div>
            <div className='buttons-mobile show-sm'>
              {currentOrder && (
                <button
                  onClick={() => generateOrder(currentOrder)}
                  className='btn btn-primary'
                >
                  <Link
                    className='text-light'
                    to={`/order-confirmation/${currentOrder._id}`}
                  >
                    <i class='fas fa-arrow-circle-right'></i>
                  </Link>
                </button>
              )}
              {!displayScroll ? (
                <button
                  onClick={() => scroll('items')}
                  className='btn btn-success'
                >
                  <i className='fas fa-shopping-cart'></i>
                </button>
              ) : (
                <button
                  onClick={() => scroll('products')}
                  className='btn btn-success'
                >
                  <i className='fas fa-shopping-cart'></i>
                </button>
              )}

              <button
                onClick={() => toggleContinueLater(!displayContinueLater)}
                className='btn btn-caution'
              >
                <i class='fas fa-save'></i>
              </button>
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

EditOrder.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(EditOrder);
