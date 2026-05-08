import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Le point d'entrée de notre application React
// C'est ici que React "s'accroche" à notre page HTML
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
