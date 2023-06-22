import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Suppliers from "./components/suppliers/Suppliers";
import Supplier from "./components/supplier/Supplier";
import CreateOrder from "./components/orders/CreateOrder";
import OrderConfirmation from "./components/orders/OrderConfirmation";
import OrderDetails from "./components/orders/OrderDetails";
import Favourites from "./components/orders/Favourites";
import EditOrder from "./components/orders/EditOrder";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";

import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //run an effect and clean it once on mount/unmount
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <section className="container">
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/suppliers" component={Suppliers} />
              <PrivateRoute exact path="/supplier/:id" component={Supplier} />
              <PrivateRoute
                exact
                path="/order-details/:id"
                component={OrderDetails}
              />
              <PrivateRoute
                exact
                path="/create-order"
                component={CreateOrder}
              />
              <PrivateRoute
                exact
                path="/create-order/:id"
                component={CreateOrder}
              />
              <PrivateRoute
                exact
                path="/order-confirmation/:id"
                component={OrderConfirmation}
              />
              <PrivateRoute
                exact
                path="/edit-order/:id"
                component={EditOrder}
              />
              <PrivateRoute exact path="/favourites" component={Favourites} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
