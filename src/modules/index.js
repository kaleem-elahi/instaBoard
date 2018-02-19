import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import receivedData from '../reducers/index';

export default combineReducers({
  routing: routerReducer,
  receivedData,
});
