import { combineReducers } from 'redux';
import alerts from './alerts';
import auth from './auth';
import orders from './orders';

export default combineReducers({
  alerts,
  auth,
  orders
});
