import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './containers/App/App';

// styles
import 'antd/dist/antd.css';
import './sources/styles/styles.scss';
import './sources/styles/reset.scss';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
