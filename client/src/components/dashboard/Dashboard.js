import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { updateUser, deleteProduct } from "../../actions/dashboard";
import { deleteSupplier } from "../../actions/suppliers";
import ProductForm from "../suppliers/ProductForm";
import ProductDialog from "../suppliers/ProductDialog";
import SupplierForm from "../suppliers/SupplierForm";
import UserForm from "./UserForm";
import SupplierDialog from "../suppliers/SupplierDialog";
import SearchBox from "../layout/SearchBox";
import Alert from "../layout/Alert";
import axios from "axios";

const Dashboard = ({ auth: { user } }) => {
  const [displayEditUser, toggleEditUser] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [displayEditProduct, toggleEditProduct] = useState(false);
  const [displayDeleteProduct, toggleDeleteProduct] = useState(false);
  const [displayEditSupplier, toggleEditSupplier] = useState(false);
  const [displayDeleteSupplier, toggleDeleteSupplier] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    query: "",
    query2: "",
    query3: "",
  });

  console.log(process.env.REACT_APP_BASE_URL);

  const { query, query2, query3 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const fetchData = async () => {
      const user = await axios.get(`/api/users/me`);
      const suppliers = await axios.get(`/api/supplier`);
      const orders = await axios.get(`/api/order`);
      const products = await axios.get(`/api/users/products`);
      setCurrentUser(user.data);
      setProducts(products.data);
      setSuppliers(suppliers.data);
      setOrders(orders.data);
    };
    fetchData();
  }, []);

  const editProduct = async (product) => {
    setCurrentProduct(product);
    toggleEditProduct(!displayEditProduct);
  };

  const editSupplier = async (supplier) => {
    setCurrentSupplier(supplier);
    toggleEditSupplier(!displayEditSupplier);
  };

  const productDeletion = async (product) => {
    setCurrentProduct(product);
    toggleDeleteProduct(!displayDeleteProduct);
  };

  const supplierDeletion = async (supplier) => {
    setCurrentSupplier(supplier);
    toggleDeleteSupplier(!displayDeleteSupplier);
  };

  return (
    <Fragment>
      {user === null ? (
        <Spinner />
      ) : (
        <Fragment>
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
          {displayEditProduct && (
            <ProductForm
              toggle={toggleEditProduct}
              display={displayEditProduct}
              product={currentProduct}
              list={products}
              setList={setProducts}
              cancel={true}
              action="edit"
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
          {displayEditSupplier && (
            <SupplierForm
              toggle={toggleEditSupplier}
              display={displayEditSupplier}
              supplier={currentSupplier}
              list={suppliers}
              setList={setSuppliers}
              cancel={true}
            />
          )}
          {displayEditUser && (
            <UserForm
              toggle={toggleEditUser}
              display={displayEditUser}
              user={user}
              setList={setCurrentUser}
              cancel={true}
            />
          )}
          <section className="container">
            <h1 className="large text-primary">
              <i className="fas fa-user"></i> Dashboard
            </h1>
            <Alert />
            <div className="details">
              <div className="details-header bg-primary">
                <h1>Account Information</h1>
              </div>
              <div className="details-body-top bg-light">
                <div className="details-body-top-item">
                  <p className="lead">Company Name:</p>{" "}
                  <p className="bottom">{currentUser.companyName}</p>
                </div>
                <div className="details-body-top-item">
                  <p className="lead">Contact Name:</p>{" "}
                  <p>{currentUser.contactName}</p>
                </div>
                <div className="details-body-top-item">
                  <p className="lead">Email:</p> <p>{currentUser.email}</p>
                </div>
                <div className="details-body-top-edit">
                  <button
                    onClick={() => toggleEditUser(!displayEditUser)}
                    className="btn btn-success"
                  >
                    <i className="far fa-edit"></i> Edit Info
                  </button>
                </div>
              </div>
              <div className="details-body bg-white p-1">
                <h2 className="p-1">Orders</h2>
                <div class="search">
                  <input
                    name="query"
                    value={query}
                    placeholder="Search by Date"
                    type="text"
                    className="searchTerm"
                    onChange={(e) => onChange(e)}
                  ></input>
                  <button type="submit" class="searchButton">
                    <i class="fa fa-search"></i>
                  </button>
                </div>
                <div class="products">
                  <SearchBox list={orders} query={query} data={"orders"} />
                </div>
                <div className="line"></div>
                <h2 className="py-1">Products</h2>
                <div class="search">
                  <input
                    name="query2"
                    value={query2}
                    placeholder="Search by Name"
                    type="text"
                    className="searchTerm"
                    onChange={(e) => onChange(e)}
                  ></input>
                  <button type="submit" class="searchButton">
                    <i class="fa fa-search"></i>
                  </button>
                </div>
                <Alert />
                <SearchBox
                  list={products}
                  selectItem={editProduct}
                  selectItem2={productDeletion}
                  query={query2}
                  data={"productsDash"}
                />
                <div className="line"></div>
                <h2 className="p-1">Suppliers</h2>
                <div class="search">
                  <input
                    name="query3"
                    value={query3}
                    placeholder="Search by Name"
                    type="text"
                    className="searchTerm"
                    onChange={(e) => onChange(e)}
                  ></input>
                  <button type="submit" class="searchButton">
                    <i class="fa fa-search"></i>
                  </button>
                </div>
                <Alert />
                <SearchBox
                  list={suppliers}
                  selectItem={supplierDeletion}
                  selectItem2={editSupplier}
                  query={query3}
                  data={"suppliersDash"}
                />
              </div>
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(withRouter(Dashboard));
