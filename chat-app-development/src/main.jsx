import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Remove loading screen when app loads
document.addEventListener('DOMContentLoaded', () => {
  const loading = document.querySelector('.loading');
  if (loading) {
    setTimeout(() => {
      loading.style.opacity = '0';
      setTimeout(() => loading.remove(), 500);
    }, 1500);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />)