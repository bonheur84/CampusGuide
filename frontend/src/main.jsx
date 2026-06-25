import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Enregistrer le service worker pour le mode hors ligne PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker enregistré avec succès:', registration.scope);
      })
      .catch((error) => {
        console.log('Erreur lors de l\'enregistrement du Service Worker:', error);
      });
  });
}

// Le point d'entrée de notre application React
// C'est ici que React "s'accroche" à notre page HTML
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
