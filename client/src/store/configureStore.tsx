import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import {composeWithDevTools} from 'redux-devtools-extension';

const composeEnhancers = compose();

export default () => {
    const store = createStore(
        combineReducers({
            auth: authReducer
        }),
        composeWithDevTools(),
    );
    return store;
}