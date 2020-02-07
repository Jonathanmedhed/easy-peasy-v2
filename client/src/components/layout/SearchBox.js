import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const ProductSearchBox = ({ list, selectItem, selectItem2, query, data }) => {
  if (data === 'products') {
    let filteredProducts = list.filter(product => {
      return product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    return (
      <Fragment>
        <div className='table-container'>
          <table className='table hide-sm'>
            <thead className='bg-primary'>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Unit</th>
                <th>Supplier</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.unit}</td>
                  <td>{product.supplierName}</td>
                  <td>
                    <button
                      onClick={() => selectItem(product)}
                      className='btn btn-primary'
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className='table show-sm'>
            <tbody>
              <td>
                <tr>
                  <th className='table-header bg-primary'>Product</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>{product.name}</td>
                  ))}
                </tr>
                <tr>
                  <th className='table-header bg-primary'>Brand</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>{product.brand}</td>
                  ))}
                </tr>
                <tr>
                  <th className='table-header bg-primary'>Unit</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>{product.unit}</td>
                  ))}
                </tr>
                <tr>
                  <th className='table-header bg-primary'>Supplier</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>{product.supplierName}</td>
                  ))}
                </tr>
                <tr>
                  <th className='table-header bg-primary'>Options</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>
                      <button
                        onClick={() => selectItem(product)}
                        className='btn btn-primary'
                      >
                        Select
                      </button>
                    </td>
                  ))}
                </tr>
              </td>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  } else if (data === 'items') {
    let filteredProducts = list.filter(product => {
      return product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    return (
      <Fragment>
        <div className='table-container'>
          <table className='table hide-sm'>
            <thead className='bg-primary'>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Supplier</th>
                <th>Qty</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.brand}</td>
                  <td>{item.supplierName}</td>
                  <td>
                    {item.qty} {item.unit}
                  </td>
                  <td>
                    <button
                      onClick={() => selectItem(item)}
                      className='btn btn-danger'
                    >
                      <i className='far fa-trash-alt'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className='table show-sm'>
            <tbody>
              <td>
                <tr>
                  <th className='table-header bg-primary'>Product</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>{product.name}</td>
                  ))}
                </tr>
                <tr>
                  <th className='table-header bg-primary'>Brand</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>{product.brand}</td>
                  ))}
                </tr>
                <tr>
                  <th className='table-header bg-primary'>Supplier</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>{product.supplierName}</td>
                  ))}
                </tr>
                <tr>
                  <th className='table-header bg-primary'>Qty</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>{product.qty} {product.unit}</td>
                  ))}
                </tr>
                <tr>
                  <th className='table-header bg-primary'>Options</th>
                  {filteredProducts.map(product => (
                    <td className='td-sm'>
                      <button
                        onClick={() => selectItem(product)}
                        className='btn btn-danger'
                      >
                        <i className='far fa-trash-alt'></i>
                      </button>
                    </td>
                  ))}
                </tr>
              </td>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  } else if (data === 'productsDash') {
    let filteredProducts = list.filter(product => {
      return product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    return (
      <div className='table-container'>
        <table className='table hide-sm'>
          <thead className='bg-primary'>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Unit</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.unit}</td>
                <td>
                  <button
                    onClick={() => selectItem2(product)}
                    className='btn btn-danger'
                  >
                    <i className='far fa-trash-alt'></i>
                  </button>
                  <button
                    onClick={() => selectItem(product)}
                    className='btn btn-success'
                  >
                    <i className='far fa-edit'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className='table show-sm'>
          <tbody>
            <td>
              <tr>
                <th className='table-header bg-primary'>Product</th>
                {filteredProducts.map(product => (
                  <td className='td-sm'>{product.name}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Brand</th>
                {filteredProducts.map(product => (
                  <td className='td-sm'>{product.brand}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Unit</th>
                {filteredProducts.map(product => (
                  <td className='td-sm'>{product.unit}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Options</th>
                {filteredProducts.map(product => (
                  <td className='td-sm'>
                    <button
                      onClick={() => selectItem2(product)}
                      className='btn btn-danger'
                    >
                      <i className='far fa-trash-alt'></i>
                    </button>
                    <button
                      onClick={() => selectItem(product)}
                      className='btn btn-success'
                    >
                      <i className='far fa-edit'></i>
                    </button>
                  </td>
                ))}
              </tr>
            </td>
          </tbody>
        </table>
      </div>
    );
  } else if (data === 'suppliers') {
    let filteredSuppliers = list.filter(supplier => {
      return (
        supplier.companyName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
    return (
      <div className='table-container'>
        <table className='table hide-sm'>
          <thead className='bg-primary'>
            <tr>
              <th>Supplier</th>
              <th>Email</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map(supplier => (
              <tr key={supplier._id}>
                <td>{supplier.companyName}</td>
                <td>{supplier.email}</td>
                <td>
                  <Link to={`supplier/${supplier._id}`}>
                    <button className='btn btn-primary'>
                      <i className='fas fa-info'></i>
                      <span className='hide-sm'> Info</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => selectItem(supplier)}
                    className='btn btn-success'
                  >
                    <i className='fas fa-plus'></i>
                    <span className='hide-sm'> Product</span>
                  </button>
                  <button
                    onClick={() => selectItem2(supplier)}
                    className='btn btn-danger'
                  >
                    <i className='far fa-trash-alt'></i>
                    <span className='hide-sm'> Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className='table show-sm'>
          <tbody>
            <td>
              <tr>
                <th className='table-header bg-primary'>Supplier</th>
                {filteredSuppliers.map(supplier => (
                  <td className='td-sm'>{supplier.companyName}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Email</th>
                {filteredSuppliers.map(supplier => (
                  <td className='td-sm'>{supplier.email}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Options</th>
                {filteredSuppliers.map(supplier => (
                  <td className='td-sm'>
                    <div className='small-buttons'>
                      <Link to={`supplier/${supplier._id}`}>
                        <button className='btn btn-primary'>
                          <i className='fas fa-info'></i>
                        </button>
                      </Link>
                      <button
                        onClick={() => selectItem(supplier)}
                        className='btn btn-success'
                      >
                        <i className='fas fa-plus'></i>
                      </button>
                      <button
                        onClick={() => selectItem2(supplier)}
                        className='btn btn-danger'
                      >
                        <i className='far fa-trash-alt'></i>
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </td>
          </tbody>
        </table>
      </div>
    );
  } else if (data === 'suppliersDash') {
    let filteredSuppliers = list.filter(supplier => {
      return (
        supplier.companyName.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    });
    return (
      <div className='table-container'>
        <table className='table hide-sm'>
          <thead className='bg-primary'>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map(supplier => (
              <tr key={supplier._id}>
                <td>{supplier.companyName}</td>
                <td>{supplier.contactName}</td>
                <td>{supplier.email}</td>
                <td>
                  <button
                    onClick={() => selectItem(supplier)}
                    className='btn btn-danger'
                  >
                    <i className='far fa-trash-alt'></i>
                  </button>
                  <button
                    onClick={() => selectItem2(supplier)}
                    className='btn btn-success'
                  >
                    <i className='far fa-edit'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className='table show-sm'>
          <tbody>
            <td>
              <tr>
                <th className='table-header bg-primary'>Company</th>
                {filteredSuppliers.map(supplier => (
                  <td className='td-sm'>{supplier.companyName}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Contact</th>
                {filteredSuppliers.map(supplier => (
                  <td className='td-sm'>{supplier.contactName}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Email</th>
                {filteredSuppliers.map(supplier => (
                  <td className='td-sm'>{supplier.email}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Options</th>
                {filteredSuppliers.map(supplier => (
                  <td className='td-sm'>
                    <button
                      onClick={() => selectItem(supplier)}
                      className='btn btn-danger'
                    >
                      <i className='far fa-trash-alt'></i>
                    </button>
                    <button
                      onClick={() => selectItem2(supplier)}
                      className='btn btn-success'
                    >
                      <i className='far fa-edit'></i>
                    </button>
                  </td>
                ))}
              </tr>
            </td>
          </tbody>
        </table>
      </div>
    );
  } else if (data === 'favourites') {
    let filteredOrders = list.filter(order => {
      return order.fav.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    return (
      <div className='table-container'>
        <table class='table hide-sm'>
          <thead class='bg-primary'>
            <th>Name</th>
            <th>Options</th>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <Fragment>
                <p className='lead'>No Favourites orders yet</p>
              </Fragment>
            ) : (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.fav}</td>
                  <td>
                    <Link to={`order-confirmation/${order._id}`}>
                      <button class='btn btn-primary'>
                        <i class='fas fa-arrow-circle-right'></i> Send
                      </button>
                    </Link>
                    <Link to={`edit-order/${order._id}`}>
                      <button class='btn btn-success'>
                        <i className='far fa-edit'></i> Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => selectItem(order)}
                      class='btn btn-danger'
                    >
                      <i className='far fa-trash-alt'></i> Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <table className='table show-sm'>
          <tbody>
            <td>
              <tr>
                <th className='table-header bg-primary'>Name</th>
                {filteredOrders.map(order => (
                  <td className='td-sm'>{order.fav}</td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Options</th>
                {filteredOrders.map(order => (
                  <td className='td-sm'>
                    <div className='small-buttons'>
                    <Link to={`order-confirmation/${order._id}`}>
                      <button class='btn btn-primary'>
                        <i class='fas fa-arrow-circle-right'></i>
                      </button>
                    </Link>
                    <Link to={`edit-order/${order._id}`}>
                      <button class='btn btn-success'>
                        <i className='far fa-edit'></i>
                      </button>
                    </Link>
                    <button
                      onClick={() => selectItem(order)}
                      class='btn btn-danger'
                    >
                      <i className='far fa-trash-alt'></i>
                    </button>
                    </div>
                  </td>
                ))}
              </tr>
            </td>
          </tbody>
        </table>
      </div>
    );
  } else if (data === 'orders') {
    let filteredOrders = list.filter(order => {
      return (
        moment(order.date)
          .format('DD-MM-YYYY HH:mm')
          .indexOf(query.toLowerCase()) !== -1
      );
    });

    return (
      <div className='table-container'>
        <table className='table hide-sm'>
          <thead className='bg-primary'>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>
                  <Moment format='DD-MM-YYYY HH:mm'>{order.date}</Moment>
                </td>
                <td>
                  {order.sent === null || order.sent === false
                    ? 'sent'
                    : 'not sent'}
                </td>
                <td>
                  <Link to={`/order-details/${order._id}`}>
                    <button className='btn btn-success'>
                      <i className='fas fa-info'></i>
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className='table show-sm'>
          <tbody>
            <td>
              <tr>
                <th className='table-header bg-primary'>Date</th>
                {filteredOrders.map(order => (
                  <td className='td-sm'>
                    <Moment format='DD-MM-YYYY HH:mm'>{order.date}</Moment>
                  </td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Status</th>
                {filteredOrders.map(order => (
                  <td className='td-sm'>
                    {order.sent === null || order.sent === false
                      ? 'sent'
                      : 'not sent'}
                  </td>
                ))}
              </tr>
              <tr>
                <th className='table-header bg-primary'>Options</th>
                {filteredOrders.map(order => (
                  <td className='td-sm'>
                    <Link to={`/order-details/${order._id}`}>
                      <button className='btn btn-success'>
                        <i className='fas fa-info'></i>
                      </button>
                    </Link>
                  </td>
                ))}
              </tr>
            </td>
          </tbody>
        </table>
      </div>
    );
  }
};

export default connect(null)(ProductSearchBox);
