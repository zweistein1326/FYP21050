import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./index.css";

import configureStore from './store/configureStore';
import {Provider} from 'react-redux';



ReactDOM.render(
  <React.StrictMode>
      <App />    
  </React.StrictMode>,
  document.getElementById('root'),
);
