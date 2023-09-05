import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


//importing root element from DOM
const root = ReactDOM.createRoot(document.getElementById('root'));

//RENDERING COMPONENT
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
