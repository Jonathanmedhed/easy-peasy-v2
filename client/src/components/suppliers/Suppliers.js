import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import Alert from '../layout/Alert';
import SupplierForm from './SupplierForm';
import ProductForm from './ProductForm';
import SupplierDialog from './SupplierDialog';
import ProductDialog from './ProductDialog';
import SearchBox from '../layout/SearchBox';
import axios from 'axios';

const Suppliers = ({ auth: { user } }) => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [displayAddSupplier, toggleAddSupplier] = useState(false);
  const [displayAddProduct, toggleAddProduct] = useState(false);
  const [displayDeleteSupplier, toggleDeleteSupplier] = useState(false);
  const [displayDeleteProduct, toggleDeleteProduct] = useState(false);

  const [formData, setFormData] = useState({
    query: ''
  });

  const { query } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const setData = async () => {
      const res = await axios.get(`/api/supplier`);
      setSuppliers(res.data);
    };
    setData();
  }, []);

  const supplierDeletion = async supplier => {
    setCurrentSupplier(supplier);
    toggleDeleteSupplier(!displayDeleteSupplier);
  };

  const productAdition = async supplier => {
    setCurrentSupplier(supplier);
    toggleAddProduct(!displayAddProduct);
  };

  return (
    <Fragment>
      {suppliers === [] ? (
        <Spinner />
      ) : (
        <Fragment>
          {displayAddSupplier && (
            <SupplierForm
              toggle={toggleAddSupplier}
              display={displayAddSupplier}
              list={suppliers}
              setList={setSuppliers}
              cancel={true}
              action={'create'}
            />
          )}
          {displayAddProduct && (
            <ProductForm
              toggle={toggleAddProduct}
              display={displayAddProduct}
              id={currentSupplier._id}
              cancel={true}
              action={'justAdd'}
            />
          )}
          {displayDeleteSupplier && (
            <SupplierDialog
              toggle={toggleDeleteSupplier}
              display={displayDeleteSupplier}
              supplier={currentSupplier}
              list={suppliers}
              setList={setSuppliers}
              cancel={true}
            />
          )}
          {displayDeleteProduct && (
            <ProductDialog
              toggle={toggleDeleteProduct}
              display={displayDeleteProduct}
              id={currentSupplier._id}
              product_id={currentProduct._id}
              cancel={true}
            />
          )}
          <section className='container'>
            <h1 className='large text-primary'>
              <i className='far fa-address-book'></i> Suppliers
            </h1>
            <p className='lead my-1'>
              Add, modify and add products to Suppliers
            </p>
            <button
              onClick={() => toggleAddSupplier(!displayAddSupplier)}
              className='btn btn-success'
            >
              <i className='fas fa-plus'></i>
              <span > Add Supplier</span>
            </button>

            <Alert />
            <div class='search mt-1'>
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
            <div className='products'>
              <SearchBox
                list={suppliers}
                selectItem={productAdition}
                selectItem2={supplierDeletion}
                query={query}
                data={'suppliers'}
              />
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

Suppliers.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(Suppliers);
