import { createStore, applyMiddleware } from 'redux'; // applyMiddleware is because we are using thunk which is middleware
import { composeWithDevTools } from 'redux-devtools-extension'; // 
import thunk from 'redux-thunk'; // thunk is a middleware 
import rootReducer from './reducers'; // we are having multiple reducers and we are combining them into a rootReducer

const initialState = {}; // initial state empty object

const middleware = [thunk];

const store = createStore( rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;

