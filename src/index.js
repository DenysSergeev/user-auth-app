import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import axios from 'axios';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(function (config) {
  config.headers['X-Binarybox-Api-Key'] = process.env.REACT_APP_API_KEY;
  return config;
});

root.render(<App />);
