import React, { Fragment, useEffect, useState } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import axios from 'axios';

function OrderDetails({ match }) {
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    if (match.params.id) {
      const fetchData = async () => {
        const result = await axios.get(`/api/order/${match.params.id}`);
        setSuppliers(result.data.suppliers);
        setProducts(result.data.products);
        setOrder(result.data.order);
      };
      fetchData();
    }
  }, []);

  return order === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <section class='container'>
        <h1 class='large text-primary'>Order Details</h1>
        <Alert />
        <div class='details hide-sm'>
          <div className='details-header bg-primary p-1'>
            <h1>Order: {order._id}</h1>
            <h1>
              Date: {<Moment format='DD-MM-YYYY HH:mm'>{order.date}</Moment>}
            </h1>
          </div>
          <div class='details-body bg-light p-1'>
            {suppliers.map(supplier => (
              <Fragment>
                <h2 class='p-1'>{supplier.companyName}</h2>
                <table class='table'>
                  <thead class='bg-primary'>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Unit</th>
                    <th>Qty</th>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      if (
                        product.supplier.toString() === supplier._id.toString()
                      ) {
                        return (
                          <tr>
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>{product.unit}</td>
                            <td>{product.qty}</td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
                <table class='table'>
                  <thead class='bg-primary'>
                    <th>Email Sent</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <textarea value={supplier.emailToSend} />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class='line'></div>
              </Fragment>
            ))}
          </div>
        </div>
        <div class='details show-sm'>
          <div className='details-header-order bg-primary'>
            <div className='head'>
              <p className='lead'>ID: </p>
              <p>{order._id}</p>
            </div>
            <div className='head'>
              <p className='lead'>Date: </p>
              <p>{<Moment format='DD-MM-YYYY HH:mm'>{order.date}</Moment>}</p>
            </div>
          </div>
          <div class='details-body bg-light p-1'>
            {suppliers.map(supplier => (
              <Fragment>
                <h2 class='p-1'>{supplier.companyName}</h2>
                <table class='table-order'>
                  <thead class='bg-primary'>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Qty</th>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      if (
                        product.supplier.toString() === supplier._id.toString()
                      ) {
                        return (
                          <tr>
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>{product.qty} x {product.unit}</td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
                <table class='table'>
                  <thead class='bg-primary'>
                    <th>Email Sent</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <textarea value={supplier.emailToSend} />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class='line'></div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default OrderDetails;
