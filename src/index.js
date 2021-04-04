import React, { createContext } from 'react'
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import mobxStores from './mobxStores'

import 'antd/dist/antd.css';
import './styles/index.scss';
// import store from './mobxStores'

// const GlobalStore = createContext(mobxStores);

ReactDOM.render(
  <React.StrictMode>
    {/*<GlobalStore.Provider>*/}
      <App />
    {/*</GlobalStore.Provider>*/}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
