import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import {composeWithDevTools} from 'redux-devtools-extension';

// const composeEnhancers = compose();
declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
  }

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    auth: authReducer
  });

export type AppState = ReturnType<typeof rootReducer>;

export default () => {
    const middlewares = [thunk]
    const middlewareEnhancer = applyMiddleware(...middlewares)
    const store = createStore(
        rootReducer,
        // composeWithDevTools(),
        composeEnhancers(middlewareEnhancer)
    );
    return store;
}