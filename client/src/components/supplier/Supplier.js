import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import SearchBox from '../layout/SearchBox';
import Alert from '../layout/Alert';
import ProductForm from '../suppliers/ProductForm';
import ProductDialog from '../suppliers/ProductDialog';
import SupplierForm from '../suppliers/SupplierForm';
import { getSupplierById } from '../../actions/suppliers';
import axios from 'axios';

function Supplier({ match }) {
  const [supplier, setSupplier] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [displayEditProduct, toggleEditProduct] = useState(false);
  const [displayDeleteProduct, toggleDeleteProduct] = useState(false);
  const [displayEdit, toggleEdit] = useState(false);

  const [formData, setFormData] = useState({
    query: ''
  });

  const { query } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/supplier/${match.params.id}`);
      setSupplier(result.data);
      const result2 = await axios.get(
        `/api/supplier/${match.params.id}/products`
      );
      setProducts(result2.data);
    };
    fetchData();
  }, []);

  const productDeletion = async product => {
    setCurrentProduct(product);
    toggleDeleteProduct(!displayDeleteProduct);
  };

  const editProduct = async product => {
    setCurrentProduct(product);
    toggleEditProduct(!displayEditProduct);
  };

  return supplier === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/suppliers' className='btn'>
        Back To Suppliers
      </Link>
      {displayDeleteProduct && (
        <ProductDialog
          toggle={toggleDeleteProduct}
          display={displayDeleteProduct}
          product={currentProduct}
          list={products}
          setList={setProducts}
          cancel={true}
        />
      )}
      {displayEdit && (
        <SupplierForm
          toggle={toggleEdit}
          display={displayEdit}
          supplier={supplier}
          setList={setSupplier}
          action={'edit'}
          cancel={true}
        />
      )}
      {displayEditProduct && (
        <ProductForm
          toggle={toggleEditProduct}
          display={displayEditProduct}
          supplier={supplier}
          product={currentProduct}
          setList={setProducts}
          cancel={true}
        />
      )}
      <section className='container'>
        <h1 className='large text-primary'>Supplier Details</h1>
        <Alert />
        <div className='details'>
          <div className='details-header bg-primary'>
            <p className='lead'>ID: {supplier._id}</p>
          </div>
          <div className='details-body-top bg-light'>
            <div className='details-body-top-item'>
              <p className='lead '>Company Name:</p>{' '}
              <p>{supplier.companyName}</p>
            </div>
            <div className='details-body-top-item'>
              <p className='lead'>Contact Name:</p>{' '}
              <p>{supplier.contactName}</p>
            </div>
            <div className='details-body-top-item'>
              <p className='lead'>Email:</p> <p>{supplier.email}</p>
            </div>
            <div className='details-body-top-edit'>
              <button
                onClick={() => toggleEdit(!displayEdit)}
                className='btn btn-success'
              >
                <i className='far fa-edit'></i> Edit Info
              </button>
            </div>
          </div>
          <div className='details-body bg-white p-1'>
            <h2 className='p-1'>Products</h2>
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
            <SearchBox
              list={products}
              selectItem={editProduct}
              selectItem2={productDeletion}
              query={query}
              data={'productsDash'}
            />
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Supplier;
